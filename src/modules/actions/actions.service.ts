import { Due } from '@prisma/client';
import { GITHUB_ACTION_SECRET } from '../../app/config';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { TAddDiscountPayload } from './action.validation';

const addMonthlyDues = async (query: TObject) => {
  const secret = query.secret;
  console.log(secret);
  if (secret !== GITHUB_ACTION_SECRET) throw new AppError('You are not authorized to perform this action', 401);

  // finding students who did not have any due record for this month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const students = await prismaClient.student.findMany({
    select: { id: true, classroom: { select: { class: { select: { monthlyFee: true, id: true } } } } },
  });

  const dues = await prismaClient.due.findMany({
    where: { month: currentMonth, year: currentYear, type: 'MONTHLY_FEE' },
    select: { studentId: true },
  });

  const duesSet = new Set(dues.map((due) => due.studentId));

  const dueInputData: Array<Pick<Due, 'studentId' | 'classId' | 'type' | 'year' | 'month' | 'amount'>> = [];
  students.forEach((student) => {
    if (duesSet.has(student.id)) return;

    const { id, classroom } = student;
    dueInputData.push({
      studentId: id,
      classId: classroom.class.id,
      type: 'MONTHLY_FEE',
      year: currentYear,
      month: currentMonth,
      amount: classroom.class.monthlyFee,
    });
  });

  if (!dueInputData.length) throw new AppError('Already added this months due data', 400);

  const newDues = await prismaClient.due.createMany({ data: dueInputData });
  return `Added total ${newDues.count} due records.`;
};

const addDiscount = async (payload: TAddDiscountPayload) => {
  await prismaClient.discount.create({ data: payload });
  return 'Discount Granted!';
};

export const actionsService = { addMonthlyDues, addDiscount };
