import { TAddNotePayload, TAssignSubjectTeacherPayload, TCreateClassroomPayload } from './classroom.validation';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
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

const getClassroomDetailsById = async (classroomId: string) => {
  const classroom = await prismaClient.classroom.findUnique({
    where: { id: classroomId },
    select: { name: true, class: { select: { level: true } } },
  });

  if (!classroom) throw new AppError('Classroom not found', 404);
  return { name: classroom.name, level: classroom.class.level };
};

const assignSubjectTeacher = async (payload: TAssignSubjectTeacherPayload) => {
  const isSubjectTeacherAssigned = await prismaClient.classroomSubjectTeacher.findFirst({
    where: { ...payload },
    select: { subject: { select: { name: true } } },
  });

  if (isSubjectTeacherAssigned)
    throw new AppError(`You have already assigned a teacher for ${isSubjectTeacherAssigned.subject.name}`, 400);

  await prismaClient.classroomSubjectTeacher.create({ data: { ...payload } });
  return 'Teacher assigned successfully';
};

const getSubjectListForClassroom = async (classroomId: string) => {
  const classroomInfo = await prismaClient.classroom.findUnique({
    where: { id: classroomId },
    select: { classId: true },
  });

  if (!classroomInfo) throw new AppError('Section not found!', 404);

  const subjects = await prismaClient.classSubject.findMany({
    where: { classId: classroomInfo.classId },
    select: { subject: { select: { id: true, name: true } } },
  });

  const assignedSubjects = await prismaClient.classroomSubjectTeacher.findMany({
    where: { classroomId },
    select: { id: true, subjectId: true, teacher: { select: { id: true, name: true, phone: true } } },
  });

  const assignedSubjectMap = new Map(assignedSubjects.map((item) => [item.subjectId, item]));

  const subjectList = subjects.map((item) => {
    const subjectId = item.subject.id;
    const subjectName = item.subject.name;
    const assignedSubjectData = assignedSubjectMap.get(subjectId);
    if (assignedSubjectData) return { ...assignedSubjectData, subjectName };
    return { id: null, subjectId, subjectName, teacher: null };
  });

  return subjectList;
};

const removeSubjectTeacher = async (classroomSubjectTeacherId: string) => {
  await prismaClient.classroomSubjectTeacher.delete({ where: { id: classroomSubjectTeacherId } });
  return 'Teacher removed successfully';
};

const addNote = async (payload: TAddNotePayload, teacherId: string) => {
  // creating note
  const { title, description } = payload;
  const result = await prismaClient.$transaction(async (client) => {
    const note = await client.note.create({
      data: { title, ...(description && { description }), createdBy: teacherId },
    });

    if (!note.id) throw new AppError('Failed to create note', 400);

    if (payload.media?.length)
      await client.media.createMany({ data: payload.media?.map((item) => ({ noteId: note.id, ...item })) || [] });

    return 'Note created successfully';
  });

  return result;
};

// exports
export const classroomService = {
  createClassroom,
  getClassroomListForTeacher,
  getStudentList,
  getClassroomDetailsById,
  removeSubjectTeacher,
  getSubjectListForClassroom,
  assignSubjectTeacher,
  addNote,
};
