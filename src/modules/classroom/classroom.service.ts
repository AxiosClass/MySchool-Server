import { TAssignSubjectTeacher, TCreateClassroomPayload } from './classroom.validation';
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

const getSubjectListWithTeacher = async (classroomId: string) => {
  const subjectsWithTeacher = await prismaClient.classroomSubjectTeacher.findMany({
    where: { classroomId },
    select: { id: true, subject: { select: { id: true, name: true } }, teacher: { select: { id: true, name: true } } },
  });

  const subjects = await prismaClient.classSubject.findMany({
    where: { class: { classrooms: { every: { id: classroomId } } } },
    select: { name: true, id: true },
  });

  const subjectList = subjects.reduce((acc: TSubjectWithTeacher[], subject) => {
    const targetSubject = subjectsWithTeacher.find((eachSubject) => eachSubject.subject.id === subject.id);
    if (targetSubject)
      acc.push({ ...subject, classroomSubjectTeacherId: targetSubject.id, teacher: { ...targetSubject.teacher } });
    else acc.push({ ...subject });

    return acc;
  }, []);

  return subjectList;
};

// types
type TSubjectWithTeacher = {
  id: string;
  name: string;
  classroomSubjectTeacherId?: string;
  teacher?: { id: string; name: string };
};

// exports
export const classroomService = {
  createClassroom,
  assignSubjectTeacher,
  removeSubjectTeacher,
  getSubjectListWithTeacher,
};
