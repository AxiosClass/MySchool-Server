import { prismaClient } from '../../app/prisma';
import { TClassroomFinanceReport } from './due.type';

const getDueByClassroom = async () => {
  const dues = await prismaClient.due.findMany({
    select: { amount: true, student: { select: { classroomId: true } } },
  });

  const payments = await prismaClient.payment.findMany({
    select: { amount: true, student: { select: { classroomId: true } } },
  });

  const classrooms = await prismaClient.classroom.findMany({
    select: { id: true, name: true, class: { select: { level: true } } },
  });

  let totalDue = 0;
  let totalPaid = 0;
  const classroomFinanceReportGroup: Record<string, TClassroomFinanceReport> = {};

  dues.forEach((due) => {
    const classroomId = due.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId])
      classroomFinanceReportGroup[classroomId] = { totalDue: 0, totalPaid: 0 };

    classroomFinanceReportGroup[classroomId].totalDue += due.amount;
    totalDue += due.amount;
  });

  payments.forEach((payment) => {
    const classroomId = payment.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId])
      classroomFinanceReportGroup[classroomId] = { totalDue: 0, totalPaid: 0 };

    classroomFinanceReportGroup[classroomId].totalPaid += payment.amount;
    totalPaid += payment.amount;
  });

  const classroomWithDueAndPaidSummary = classrooms
    .map((classroom) => {
      const classroomFinanceInfo = classroomFinanceReportGroup[classroom.id];
      const { class: cls, ...rest } = classroom;

      return { ...rest, classLevel: cls.level, ...classroomFinanceInfo };
    })
    .sort((a, b) => Number(a.classLevel) - Number(b.classLevel));

  return { totalDue, totalPaid, classrooms: classroomWithDueAndPaidSummary };
};

export const dueService = { getDueByClassroom };
