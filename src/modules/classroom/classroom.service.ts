import { TAssignSubjectTeacher, TCreateClassroomPayload } from './classroom.validation';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

const assignSubjectTeacher = async (payload: TAssignSubjectTeacher) => {
  const isSubjectTeacherAssigned = await prismaClient.classroomSubjectTeacher.findFirst({
    where: { ...payload },
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

const getClassroomListForTeacher = async (teacherId: string) => {
  const selectOptions = { id: true, name: true, class: { select: { name: true } }, students: { select: { id: true } } };

  const classroomsWhereTeacherIsClassTeacher = await prismaClient.classroom.findMany({
    where: { classTeacherId: teacherId },
    select: selectOptions,
  });

  const classroomWhereTeacherIsSubjectTeacher = await prismaClient.classroom.findMany({
    where: { classroomSubjectTeachers: { some: { teacherId: teacherId } } },
    select: selectOptions,
  });

  const onlyClassroomWhereTeacherIsSubjectTeacher = classroomWhereTeacherIsSubjectTeacher.filter(
    (classroom) => !classroomsWhereTeacherIsClassTeacher.some((cls) => cls.id === classroom.id),
  );

  return {
    asClassTeacher: classroomsWhereTeacherIsClassTeacher,
    asSubjectTeacher: onlyClassroomWhereTeacherIsSubjectTeacher,
  };
};

const getStudentList = async (classroomId: string) => {
  const students = await prismaClient.student.findMany({
    where: { classroomId },
    select: { id: true, name: true, class: true },
  });
  return students;
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
  getClassroomListForTeacher,
  getStudentList,
};
