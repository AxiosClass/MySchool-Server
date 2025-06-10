import { TermStatus } from '@prisma/client';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { TAddOrUpdateTermPayload, TUpdateStatusPayload } from './term.validation';
import { transformer } from 'zod';

const addTerm = async (payload: TAddOrUpdateTermPayload) => {
  const previousTerm = await prismaClient.term.findMany({ where: { status: { in: ['ONGOING', 'PENDING'] } } });
  if (previousTerm.length) throw new AppError('There is an ongoing or pending term, First end the previous term', 400);

  // collecting class subject snapshot
  const classSubjects = await prismaClient.classSubject.findMany({ select: { classId: true, subjectId: true } });

  const classSubjectSnapShot = classSubjects?.reduce((acc: Record<string, string[]>, classSubject) => {
    const { classId, subjectId } = classSubject;
    if (!acc[classId]) acc[classId] = [];
    acc[classId].push(subjectId);
    return acc;
  }, {});

  const students = await prismaClient.student.findMany({
    select: { id: true, classroom: { select: { classId: true } } },
  });

  const studentClassSnapShot = students.reduce((acc: Record<string, string>, student) => {
    const { id, classroom } = student;
    acc[id] = classroom.classId;
    return acc;
  }, {});

  const year = new Date().getFullYear();
  const term = await prismaClient.term.create({
    data: {
      name: payload.name,
      year: String(year),
      classSubjects: classSubjectSnapShot,
      StudentClass: studentClassSnapShot,
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

  if (term.status === 'ENDED') throw new AppError('Term has already been ended', 400);

  const statues = [TermStatus.PENDING, TermStatus.ONGOING, TermStatus.ENDED];
  const currentStatusIndex = statues.findIndex((s) => s === term.status);
  const targetIndex = statues.findIndex((s) => s === payload.status);

  const diff = targetIndex - currentStatusIndex;
  if (diff !== 1) throw new AppError(`Can not change the status form ${term.status} to ${payload.status}`, 400);

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
