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
      classroomFinanceReportGroup[classroomId] = {
        classLevel: '',
        classroomId: classroomId,
        classroomName: '',
        totalDues: 0,
        totalPaid: 0,
      };

    classroomFinanceReportGroup[classroomId].totalDues += due.amount;
    totalDue += due.amount;
  });

  payments.forEach((payment) => {
    const classroomId = payment.student.classroomId;
    if (!classroomFinanceReportGroup[classroomId]) {
      classroomFinanceReportGroup[classroomId] = {
        classroomId,
        classLevel: '',
        classroomName: '',
        totalDues: 0,
        totalPaid: 0,
      };
    }
    classroomFinanceReportGroup[classroomId].totalPaid += payment.amount;
    totalPaid += payment.amount;
  });

  const classroomMap = new Map(classrooms.map((classroom) => [classroom.id, classroom]));

  Object.keys(classroomFinanceReportGroup).forEach((key) => {
    const classroomInfo = classroomMap.get(key);
    classroomFinanceReportGroup[key] = {
      ...classroomFinanceReportGroup[key],
      classLevel: classroomInfo?.class.level ?? '',
      classroomName: classroomInfo?.name ?? '',
    };
  });

  const classroomWithDueAndPaidSummary = Object.values(classroomFinanceReportGroup).sort(
    (a, b) => Number(a.classLevel) - Number(b.classLevel),
  );

  return { totalDue, totalPaid, classrooms: classroomWithDueAndPaidSummary };
};

export const dueService = { getDueByClassroom };
