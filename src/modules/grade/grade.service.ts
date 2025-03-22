import { ExamStatus } from '@prisma/client';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TAddOrUpdateGradePayload } from './grade.validation';

const addOrUpdateGrade = async (payload: TAddOrUpdateGradePayload, teacherId: string) => {
  // checking if theache is authrized to add grade
  const subjectInfo = await prismaClient.classroomSubjectTeacher.findFirst({
    where: { classSubjectId: payload.subjectId },
    select: { id: true, teacherId: true },
  });

  if (!subjectInfo)
    throw new AppError('No Teacher Assigned to this subject firstly assign a teacher and then try to grade', 400);

  if (subjectInfo.teacherId !== teacherId) throw new AppError('You are not authorized to garde this subject', 400);

  // checking if exam is alrady over
  const examInfo = await prismaClient.exam.findFirst({ where: { id: payload.examId }, select: { status: true } });
  if (examInfo?.status !== ExamStatus.ONGOING)
    throw new AppError('This subject can not be graded as exam is not ongoing', 400);

  // checking if it is alrady graded or not
  const isGradeExist = await prismaClient.grade.findFirst({
    where: { examId: payload.examId, subjectId: payload.studentId, studentId: payload.studentId },
  });

  const examRule = await prismaClient.examRule.findFirst({
    where: { examId: payload.examId, subjectId: payload.subjectId },
    select: { totalMarks: true },
  });

  if (!examRule) throw new AppError('Please add exam rule first', 404);

  if (payload.marks > examRule.totalMarks)
    throw new AppError('Obtained marks can not be greater than total marks', 400);

  if (isGradeExist) {
    // updating the grade
    await prismaClient.grade.update({ where: { id: isGradeExist.id }, data: { marks: payload.marks } });
    return 'Grade updated successfully';
  }

  await prismaClient.grade.create({ data: { ...payload } });

  return 'Grade added successfully';
};

export const gradeService = { addOrUpdateGrade };
