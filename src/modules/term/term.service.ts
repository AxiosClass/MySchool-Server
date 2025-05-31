import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { TAddTermPayload } from './term.validation';

const addTerm = async (payload: TAddTermPayload) => {
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

export const termService = { addTerm, getTerms };
