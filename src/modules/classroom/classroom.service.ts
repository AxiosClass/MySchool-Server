import {
  TAddNotePayload,
  TAssignSubjectTeacherPayload,
  TCreateClassroomPayload,
  TUpdateNotePayload,
} from './classroom.validation';

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
    select: { name: true, class: { select: { level: true } }, classTeacher: { select: { id: true, name: true } } },
  });

  if (!classroom) throw new AppError('Classroom not found', 404);
  return { name: classroom.name, level: classroom.class.level, classTeacher: { ...classroom.classTeacher } };
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
  const { title, description, classroomId } = payload;
  const result = await prismaClient.$transaction(async (client) => {
    // creating note
    const note = await client.note.create({
      data: { title, classroomId, ...(description && { description }), createdBy: teacherId },
    });

    if (!note.id) throw new AppError('Failed to create note', 400);

    // creating media
    if (payload.media?.length)
      await client.media.createMany({ data: payload.media?.map((item) => ({ noteId: note.id, ...item })) || [] });

    return 'Note created successfully';
  });

  return result;
};

const getNotes = async (classroomId: string) => {
  const notes = await prismaClient.note.findMany({
    where: { classroomId },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      teacher: { select: { id: true, name: true } },
      media: { select: { id: true, url: true, type: true } },
    },
  });

  return notes;
};

const updateNote = async (noteId: string, payload: TUpdateNotePayload) => {
  const { title, description } = payload;

  const isNoteExists = await prismaClient.note.findUnique({ where: { id: noteId }, select: { id: true } });
  if (!isNoteExists) throw new AppError('Note not found', 404);

  const result = await prismaClient.note.update({
    where: { id: noteId },
    data: { ...(title && { title }), ...(description && { description }) },
    select: { id: true },
  });

  if (!result.id) throw new AppError('Failed to update note', 400);
  return 'Note updated successfully';
};

const deleteNote = async (noteId: string) => {
  const isNoteExists = await prismaClient.note.findUnique({ where: { id: noteId }, select: { id: true } });
  if (!isNoteExists) throw new AppError('Note not found', 404);

  await prismaClient.$transaction(async (client) => {
    // delete media associated with the note
    await client.media.deleteMany({ where: { noteId } });
    // delete the note
    await client.note.delete({ where: { id: noteId } });
  });

  return 'Note deleted successfully';
};

const deleteMedia = async (mediaId: string) => {
  const isMediaExists = await prismaClient.media.findUnique({ where: { id: mediaId }, select: { id: true } });
  if (!isMediaExists) throw new AppError('Media not found', 404);
  await prismaClient.media.delete({ where: { id: mediaId } });

  return 'Media deleted successfully';
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
  getNotes,
  updateNote,
  deleteNote,
  deleteMedia,
};
