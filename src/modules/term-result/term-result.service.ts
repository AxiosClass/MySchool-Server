import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { getSubjectResult, getTermResultSummary } from './term-result.helper';
import { TTermResultSummary, TSubjectResult } from './term-result.types';
import { TAddTermResultPayload, termResultValidation } from './term-result.validation';

const addTermResult = async (payload: TAddTermResultPayload, teacherId: string) => {
  const { subjectId, termId, studentId, classroomId, marks } = payload;

  // Fetch subject teacher
  const subjectTeacher = await prismaClient.classroomSubjectTeacher.findUnique({
    where: { subjectId_classroomId_teacherId: { classroomId, subjectId, teacherId } },
  });

  if (!subjectTeacher) throw new AppError('You are not authorized to grade this subject', 401);

  // 1. Fetch subject
  const subject = await prismaClient.subject.findUnique({ where: { id: subjectId }, select: { type: true } });
  if (!subject) throw new AppError('Subject not found', 404);
  if (subject.type === 'COMBINED') throw new AppError('This subject cannot be graded', 400);

  // 2. Validate marks using a schema map
  const schemaMap = {
    CQ_MCQ: termResultValidation.cqMcqSchema,
    CQ_MCQ_PRACTICAL: termResultValidation.cqMcqPracticalSchema,
    WRITTEN_FULL: termResultValidation.writtenFullSchema,
    WRITTEN_HALF: termResultValidation.writtenHalfSchema,
  };

  const schema = schemaMap[subject.type];
  if (!schema) throw new AppError('Unsupported subject type', 400);
  await schema.parseAsync(marks);

  // 3. Check if result exists
  const existingResult = await prismaClient.termResult.findUnique({
    where: { termId_studentId_subjectId: { termId, studentId, subjectId } },
    select: { studentId: true },
  });

  // 4. Create or update accordingly
  if (!existingResult) {
    await prismaClient.termResult.create({ data: { subjectId, studentId, termId, marks } });
    return 'Grade has been added';
  }

  await prismaClient.termResult.update({
    where: { termId_studentId_subjectId: { termId, studentId, subjectId } },
    data: { marks },
  });

  return 'Grade updated successfully';
};

const getStudentsWithTermResult = async (query: TObject) => {
  const termId = query.termId;
  const classroomId = query.classroomId;
  const subjectId = query.subjectId;

  if (!termId || !classroomId || !subjectId)
    throw new AppError('Missing required parameters: termId, classroomId, or subjectId', 400);

  const subject = await prismaClient.subject.findUnique({ where: { id: subjectId }, select: { id: true, type: true } });

  if (!subject) throw new AppError('Subject not found', 400);

  const termResults = await prismaClient.termResult.findMany({
    where: { termId, student: { classroomId }, subjectId },
    select: { studentId: true, marks: true },
  });

  const students = await prismaClient.student.findMany({ where: { classroomId }, select: { id: true, name: true } });

  const termResultMap = new Map(termResults.map((each) => [each.studentId, each]));

  const studentsWithTermResult = students.map((student) => {
    const termResult = termResultMap.get(student.id);

    return {
      studentId: student.id,
      studentName: student.name,
      subjectType: subject.type,
      subjectId: subject.id,
      ...(termResult && { marks: termResult.marks }),
    };
  });

  return studentsWithTermResult;
};

const getTermsResultSummary = async (studentId: string, query: TObject) => {
  const year = query.year ?? new Date().getFullYear();

  const termsFromDB = await prismaClient.term.findMany({
    where: { year, status: 'ENDED' },
    select: { id: true, name: true, year: true, classSubjects: true, studentClass: true },
  });

  // termId => subjectIds[]
  const termsWithSubjects: Record<string, string[]> = {};
  const subjectIds = new Set<string>();
  const terms: Array<{ id: string; name: string; year: string; classId: string }> = [];
  const classIds: string[] = [];

  termsFromDB.forEach((term) => {
    const studentClass = term.studentClass as Record<string, string>;
    const classSubjects = term.classSubjects as Record<string, string[]>;
    const classId = studentClass[studentId];

    if (!classId) return;
    classIds.push(classId);
    // now storing classId later it will be replaced with actual class
    terms.push({ id: term.id, name: term.name, year: term.year, classId });
    const subjects = classSubjects[classId] ?? [];
    termsWithSubjects[term.id] = subjects;

    subjects.forEach((subjectId) => {
      subjectIds.add(subjectId);
    });
  });

  // fetching subjects
  const subjects = await prismaClient.subject.findMany({
    where: { id: { in: Array.from(subjectIds) } },
    select: { id: true, type: true, name: true },
  });

  // fetching results
  const termResults = await prismaClient.termResult.findMany({
    where: { termId: { in: terms.map((term) => term.id) }, studentId },
    select: { termId: true, marks: true, subjectId: true },
  });

  // fetching classes
  const classes = await prismaClient.class.findMany({
    where: { id: { in: classIds } },
    select: { id: true, name: true, level: true },
  });

  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));
  const termResultMap = new Map(termResults.map((result) => [`${result.subjectId}_${result.termId}`, result]));

  const classMap = new Map(
    classes.map((eachClass) => [eachClass.id, { name: eachClass.name, level: eachClass.level }]),
  );

  const termsResultSummary: TTermResultSummary[] = [];
  terms.forEach((term) => {
    const subjectIds = termsWithSubjects[term.id] ?? [];

    const subjectResults: TSubjectResult[] = [];
    subjectIds.forEach((subjectId) => {
      const subject = subjectMap.get(subjectId);
      if (!subject) return;

      const termResult = termResultMap.get(`${subjectId}_${term.id}`);
      const termMarks = (termResult?.marks ?? {}) as Record<string, number>;

      const subjectResult = getSubjectResult({
        subjectId,
        subjectName: subject.name,
        subjectType: subject.type,
        componentMarks: termMarks,
      });

      subjectResults.push(subjectResult);
    });

    const classInfo = classMap.get(term.classId) || { name: '', level: '' };

    const termResultSummary = getTermResultSummary({
      academicYear: term.year,
      termName: term.name,
      termId: term.id,
      subjectResults: subjectResults,
      classInfo,
    });

    termsResultSummary.push(termResultSummary);
  });

  return termsResultSummary;
};

// Types

export const termResultService = { addTermResult, getStudentsWithTermResult, getTermsResultSummary };
