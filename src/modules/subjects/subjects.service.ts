import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TCreateSubjectPayload } from './subject.validation';

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

export const subjectService = { createSubject };
