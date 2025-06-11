import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';

const getStudentsWithTermResult = async (query: TObject) => {
  const termId = query.termId;
  const classroomId = query.classroomId;
  const subjectId = query.subjectId;

  if (!termId || !classroomId || !subjectId)
    throw new AppError('Missing required parameters: termId, classroomId, or subjectId', 400);

  const termResults = await prismaClient.termResult.findMany({
    where: { termId, student: { classroomId }, subjectId },
    select: {
      studentId: true,
      student: { select: { name: true } },
      subject: { select: { type: true } },
      marks: true,
    },
  });

  const students = await prismaClient.student.findMany({ where: { classroomId }, select: { id: true, name: true } });

  const termResultMap = new Map(termResults.map((each) => [each.studentId, each]));

  const studentsWithTermResult = students.map((student) => {
    const termResult = termResultMap.get(student.id);

    return {
      studentId: student.id,
      studentName: student.name,
      ...(termResult && { subjectType: termResult.subject.type, marks: termResult.marks }),
    };
  });

  return studentsWithTermResult;
};

export const termResultService = {
  getStudentsWithTermResult,
};
