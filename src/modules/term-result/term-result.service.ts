import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
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

export const termResultService = { addTermResult, getStudentsWithTermResult };
