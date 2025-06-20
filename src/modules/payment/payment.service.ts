import { exactMatchPicker, metaGenerator } from '../../helpers/common';
import { TTakePaymentPayload } from './payment.validation';
import { prismaClient } from '../../app/prisma';
import { TObject } from '../../utils/types';

const takePayment = async (payload: TTakePaymentPayload) => {
  const payment = await prismaClient.payment.create({
    data: { ...payload },
    select: { id: true },
  });

  return payment;
};

const getPayments = async (query: TObject) => {
  const exactMatchProperties = exactMatchPicker(['month', 'year', 'type', 'studentId'], query);
  const page = Number(query.page);
  const limit = Number(query.limit) || 10;

  const payments = await prismaClient.payment.findMany({
    where: exactMatchProperties,
    orderBy: { createdAt: 'desc' },
    // apply pagination when page and limit is been passed
    ...(page && { skip: (page - 1) * limit, take: limit }),

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

  const total = await prismaClient.payment.count({ where: { ...exactMatchProperties } });

  return { meta: metaGenerator({ page, limit, total }), payments };
};

export const paymentService = { takePayment, getPayments };
