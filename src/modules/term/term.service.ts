import { TermStatus } from '@prisma/client';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { TAddOrUpdateTermPayload, TUpdateStatusPayload } from './term.validation';

const addTerm = async (payload: TAddOrUpdateTermPayload) => {
  const activeTerm = await prismaClient.term.findFirst({ where: { status: { in: ['ONGOING', 'PENDING'] } } });
  if (activeTerm) throw new AppError('There is an ongoing or pending term, First end the previous term', 400);

  // collecting class subject snapshot
  const classSubjects = await prismaClient.classSubject.findMany({
    select: { classId: true, subject: { select: { type: true, id: true, childSubject: { select: { id: true } } } } },
  });

  const classSubjectSnapShot: Record<string, string[]> = {};
  classSubjects.forEach(({ classId, subject }) => {
    if (!classSubjectSnapShot[classId]) classSubjectSnapShot[classId] = [];

    if (subject.type === 'COMBINED')
      subject.childSubject?.forEach((child) => classSubjectSnapShot[classId].push(child.id));
    else classSubjectSnapShot[classId].push(subject.id);
  });

  const students = await prismaClient.student.findMany({
    select: { id: true, classroom: { select: { classId: true } } },
  });

  // collecting student's class snap shot
  const studentClassSnapShot: Record<string, string> = {};
  students.forEach((student) => {
    const { id, classroom } = student;
    studentClassSnapShot[id] = classroom.classId;
  });

  const year = new Date().getFullYear();
  const term = await prismaClient.term.create({
    data: {
      name: payload.name,
      year: String(year),
      classSubjects: classSubjectSnapShot,
      studentClass: studentClassSnapShot,
    },
    select: { id: true },
  });

  if (!term.id) throw new AppError('Failed to create term', 500);
  return 'Term added successfully';
};

const getTerms = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  const terms = await prismaClient.term.findMany({
    where: {
      ...(searchTerm && {
        OR: [{ name: { contains: searchTerm, mode: 'insensitive' } }, { year: searchTerm }],
      }),
    },
    select: { id: true, name: true, year: true, status: true },
  });

  return terms;
};

const updateTerm = async (payload: TAddOrUpdateTermPayload, id: string) => {
  const term = await prismaClient.term.findUnique({ where: { id }, select: { id: true } });
  if (!term) throw new AppError('Term not found', 404);

  await prismaClient.term.update({ where: { id }, data: payload });
  return 'Term updated successfully';
};

const updateStatus = async (payload: TUpdateStatusPayload, termId: string) => {
  const term = await prismaClient.term.findUnique({ where: { id: termId }, select: { id: true, status: true } });
  if (!term) throw new AppError('No term found', 404);

  const allowedTransition = {
    [TermStatus.PENDING]: TermStatus.ONGOING,
    [TermStatus.ONGOING]: TermStatus.ENDED,
    [TermStatus.ENDED]: TermStatus.ONGOING,
  };

  if (allowedTransition[term.status] !== payload.status)
    throw new AppError(`Can not change the status form ${term.status} to ${payload.status}`, 400);

  if (payload.status === 'ONGOING') {
    const onGoingTerm = await prismaClient.term.findFirst({ where: { status: 'ONGOING' }, select: { id: true } });

    if (onGoingTerm?.id) throw new AppError('Transition is not allowed as another term is ongoing', 400);
  }

  await prismaClient.term.update({ where: { id: termId }, data: { status: payload.status } });
  return 'Status Updated Successfully';
};

const deleteTerm = async (termId: string) => {
  const term = await prismaClient.term.findUnique({ where: { id: termId }, select: { status: true } });
  if (!term) throw new AppError('Term not found!', 404);

  if (term.status !== 'PENDING') throw new AppError(`Exam is ${term.status} so you are not allowed to delete it.`, 400);
  await prismaClient.term.delete({ where: { id: termId } });

  return 'Term Deleted Successfully';
};

const getOngoingTerm = async () => {
  const term = await prismaClient.term.findFirst({
    where: { status: 'ONGOING' },
    select: { id: true, name: true, year: true },
  });

  return term;
};

export const termService = { addTerm, getTerms, updateTerm, updateStatus, deleteTerm, getOngoingTerm };
