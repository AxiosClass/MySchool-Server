import { TCreateSubjectPayload, TUpdateSubjectPayload } from './subject.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { SubjectType } from '@prisma/client';

const createSubject = async (payload: TCreateSubjectPayload) => {
  const hasChildren = payload.children && payload.children.length;

  const payloadData = {
    name: payload.name,
    type: payload.type,
    ...(payload.description && { description: payload.description }),
  };

  if (!hasChildren) {
    const subject = await prismaClient.subject.create({
      data: payloadData,
      select: { id: true },
    });

    if (!subject?.id) throw new AppError('Failed to create subject', 400);

    return 'Subject created successfully';
  }

  // when it has children
  const result = await prismaClient.$transaction(async (client) => {
    const subject = await client.subject.create({ data: payloadData, select: { id: true } });
    if (!subject?.id) throw new AppError('Failed to create subject', 400);

    // now creating children
    const childrenData = payload.children?.map((sub) => ({ parentId: subject.id, ...sub })) || [];
    const childrenSubjectResult = await client.subject.createMany({ data: childrenData });
    if (!childrenSubjectResult.count) throw new AppError('Failed to create sub subject', 400);

    return 'Subject Created Successfully';
  });

  return result;
};

const getSubjects = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  const type = query.type;

  const subjects = await prismaClient.subject.findMany({
    where: {
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
      ...(type && Object.values(SubjectType).includes(type as SubjectType) && { type: type as SubjectType }),
    },
  });

  return subjects;
};

const updateSubject = async (payload: TUpdateSubjectPayload, subjectId: string) => {
  await prismaClient.subject.update({ where: { id: subjectId }, data: payload });
  return 'Subject updated successfully';
};

export const subjectService = { createSubject, getSubjects, updateSubject };
