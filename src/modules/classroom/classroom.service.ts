import { prismaClient } from '../../app/prisma';
import { TCreateClassroomPayload } from './classroom.validation';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

const assignSubjectTeacher = async () => {};

export const classroomService = { createClassroom };
