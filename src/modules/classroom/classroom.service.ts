import { prismaClient } from '../../app/prisma';
import { TAssignSubjectTeacher, TCreateClassroomPayload } from './classroom.validation';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

const assignSubjectTeacher = async (payload: TAssignSubjectTeacher, classroomId: string) => {
  await prismaClient.classroomSubjectTeacher.create({ data: { ...payload, classroomId } });
  return 'Teacher assigned successfully';
};

export const classroomService = { createClassroom, assignSubjectTeacher };
