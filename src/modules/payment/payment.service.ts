import { getPaginationInfo, metaGenerator } from '../../helpers/common';
import { TTakePaymentPayload } from './payment.validation';
import { prismaClient } from '../../app/prisma';
import { PaymentType, Prisma } from '@prisma/client';
import { TObject } from '../../utils/types';

const takePayment = async (payload: TTakePaymentPayload) => {
  const payment = await prismaClient.payment.create({
    data: { ...payload },
    select: { id: true },
  });

  return payment;
};

const getPayments = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  const studentId = query.studentId;
  const type = query.type as PaymentType;
  const start = query.start;
  const end = query.end;

  const whereQuery: Prisma.PaymentWhereInput = {
    ...(searchTerm && {
      OR: [
        { student: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { studentId: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }),

    ...(studentId && { studentId }),
    ...(type && { type }),
    ...((start || end) && { createdAt: { ...(start && { gte: start }), ...(end && { lte: end }) } }),
  };

  const { page, limit, skip, getAll } = getPaginationInfo(query);

  const payments = await prismaClient.payment.findMany({
    where: whereQuery,
    orderBy: { createdAt: 'desc' },

    ...(!getAll && { skip, take: limit }),

    select: {
      id: true,
      student: { select: { id: true, name: true, class: true, classroom: { select: { name: true } } } },
      amount: true,
      description: true,
      month: true,
      year: true,
      type: true,
      createdAt: true,
    },
  });

  const total = await prismaClient.payment.count({ where: whereQuery });
  const meta = metaGenerator({ page, limit, total });

  return { meta, payments };
};

export const paymentService = { takePayment, getPayments };
