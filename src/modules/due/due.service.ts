import { prismaClient } from '../../app/prisma';
import { TFinanceReport } from './due.type';
import { AppError } from '../../utils/appError';

const getDuesByClass = async () => {
  const dues = await prismaClient.due.findMany({
    select: { amount: true, student: { select: { class: true } } },
  });

  const payments = await prismaClient.payment.findMany({
    select: { amount: true, student: { select: { class: true } } },
  });

  const discounts = await prismaClient.discount.findMany({
    select: { amount: true, student: { select: { class: true } } },
  });

  const cls = await prismaClient.class.findMany({
    select: { level: true, name: true },
  });

  const classFinanceReportGroup: Record<string, TFinanceReport> = {};

  dues.forEach((due) => {
    const classKey = due.student.class;
    if (!classFinanceReportGroup[classKey])
      classFinanceReportGroup[classKey] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classFinanceReportGroup[classKey].totalDue += due.amount;
  });

  payments.forEach((payment) => {
    const classKey = payment.student.class;
    if (!classFinanceReportGroup[classKey])
      classFinanceReportGroup[classKey] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classFinanceReportGroup[classKey].totalPaid += payment.amount;
  });

  discounts.forEach((discount) => {
    const classKey = discount.student.class;
    if (!classFinanceReportGroup[classKey])
      classFinanceReportGroup[classKey] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classFinanceReportGroup[classKey].totalDiscount += discount.amount;
  });

  const classWithDueAndPaidSummary = cls
    .map((classItem) => {
      const classKey = classItem.level;
      const classFinanceInfo = classFinanceReportGroup[classKey] || { totalDue: 0, totalPaid: 0, totalDiscount: 0 };
      return { ...classItem, ...classFinanceInfo };
    })
    .sort((a, b) => Number(a.level) - Number(b.level));

  return classWithDueAndPaidSummary;
};

const getDueByClassroom = async (classLevel: string) => {
  const classDetails = await prismaClient.class.findUnique({
    where: { level: classLevel },
    select: { id: true, level: true },
  });

  if (!classDetails) throw new AppError('No class found!', 404);

  const classrooms = await prismaClient.classroom.findMany({
    where: { classId: classDetails.id },
    select: { id: true, name: true, class: { select: { level: true } } },
  });

  const classroomIds = classrooms.map((classroom) => classroom.id);

  const dues = await prismaClient.due.findMany({
    where: { student: { classroomId: { in: classroomIds } } },
    select: { amount: true, student: { select: { classroomId: true } } },
  });

  const payments = await prismaClient.payment.findMany({
    where: { student: { classroomId: { in: classroomIds } } },
    select: { amount: true, student: { select: { classroomId: true } } },
  });

  const discounts = await prismaClient.discount.findMany({
    where: { student: { classroomId: { in: classroomIds } } },
    select: { amount: true, student: { select: { classroomId: true } } },
  });

  const classroomFinanceReportGroup: Record<string, TFinanceReport> = {};

  dues.forEach((due) => {
    const classroomId = due.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId])
      classroomFinanceReportGroup[classroomId] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classroomFinanceReportGroup[classroomId].totalDue += due.amount;
  });

  payments.forEach((payment) => {
    const classroomId = payment.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId])
      classroomFinanceReportGroup[classroomId] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classroomFinanceReportGroup[classroomId].totalPaid += payment.amount;
  });

  discounts.forEach((discount) => {
    const classroomId = discount.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId])
      classroomFinanceReportGroup[classroomId] = { totalDue: 0, totalPaid: 0, totalDiscount: 0 };

    classroomFinanceReportGroup[classroomId].totalDiscount += discount.amount;
  });

  const classroomWithDueAndPaidSummary = classrooms
    .map((classroom) => {
      const classroomFinanceInfo = classroomFinanceReportGroup[classroom.id] || {
        totalDue: 0,
        totalPaid: 0,
        totalDiscount: 0,
      };

      const { class: cls, ...rest } = classroom;

      return { ...rest, classLevel: cls.level, ...classroomFinanceInfo };
    })
    .sort((a, b) => Number(a.classLevel) - Number(b.classLevel));

  return classroomWithDueAndPaidSummary;
};

const getDueByStudent = async (classroomId: string) => {
  const students = await prismaClient.student.findMany({
    where: { classroomId },
    select: {
      id: true,
      name: true,
      class: true,
      classroom: { select: { name: true } },
      payments: { select: { id: true, amount: true } },
      dues: { select: { id: true, amount: true } },
      discounts: { select: { id: true, amount: true } },
    },
  });

  const formattedStudent = students
    .map((student) => {
      const { payments, dues, discounts, classroom, class: cls, ...rest } = student;

      const totalPayment = payments.reduce((acc, { amount }) => (acc += amount), 0);
      const totalDue = dues.reduce((acc, { amount }) => (acc += amount), 0);
      const totalDiscount = discounts.reduce((acc, { amount }) => (acc += amount), 0);

      const classroomName = classroom.name;
      const due = totalDue - totalPayment - totalDiscount;

      return { ...rest, classLevel: cls, classroomName, due };
    })
    .filter((student) => !!student.due);

  return formattedStudent;
};

export const dueService = { getDuesByClass, getDueByClassroom, getDueByStudent };
