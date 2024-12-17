import { TAssignSubjectTeacher, TCreateClassroomPayload, TReassignSubjectTeacher } from './classroom.validation';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

const assignSubjectTeacher = async (payload: TAssignSubjectTeacher) => {
  const isSubjectTeacherAssigned = await prismaClient.classroomSubjectTeacher.findFirst({
    where: { classroomId: payload.classroomId, classSubjectId: payload.classSubjectId },
    select: { subject: { select: { name: true } } },
  });

  if (isSubjectTeacherAssigned)
    throw new AppError(`You have already assigned a teacher for ${isSubjectTeacherAssigned.subject.name}`, 400);

  await prismaClient.classroomSubjectTeacher.create({ data: { ...payload } });
  return 'Teacher assigned successfully';
};

const removeSubjectTeacher = async (classroomSubjectTeacherId: string) => {
  await prismaClient.classroomSubjectTeacher.delete({ where: { id: classroomSubjectTeacherId } });
  return 'Teacher removed successfully';
};

const reassignSubjectTeacher = async (payload: TReassignSubjectTeacher, classroomSubjectTeacherId: string) => {
  await prismaClient.classroomSubjectTeacher.update({
    where: { id: classroomSubjectTeacherId },
    data: { teacherId: payload.teacherId },
  });

  return 'Teacher reassigned successfully';
};

export const classroomService = { createClassroom, assignSubjectTeacher, removeSubjectTeacher, reassignSubjectTeacher };
