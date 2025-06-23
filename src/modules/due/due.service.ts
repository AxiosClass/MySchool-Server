import { Prisma } from '@prisma/client';
import { prismaClient } from '../../app/prisma';
import { getMeta, getPaginationInfo } from '../../helpers/common';
import { TObject } from '../../utils/types';
import { TFinanceReport, TStudentDueSummary } from './due.type';
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

    classroomFinanceReportGroup[classroomId].totalPaid += discount.amount;
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

const getDueByStudent = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  const level = query.level;
  const classroomId = query.classroomId;

  const { page, limit, skip } = getPaginationInfo(query);

  // Shared filters (use null fallback for SQL-safe injection)
  const filters = {
    level: level ?? null,
    classroomId: classroomId ?? null,
    searchTerm: searchTerm ?? null,
  };

  // Shared SQL fragment for FROM, JOINs, WHERE, GROUP BY, HAVING
  const baseQuery = Prisma.sql`
    FROM students s
    JOIN classrooms cr ON s."classroomId" = cr.id
    LEFT JOIN dues d ON s.id = d."studentId"
    LEFT JOIN payments p ON s.id = p."studentId"
    WHERE 1 = 1
      AND (${filters.level} IS NULL OR s.class = ${filters.level})
      AND (${filters.classroomId} IS NULL OR cr.id = ${filters.classroomId})
      AND (
        ${filters.searchTerm} IS NULL OR
        s.id ILIKE CONCAT('%', ${filters.searchTerm}, '%') OR
        s.name ILIKE CONCAT('%', ${filters.searchTerm}, '%')
      )
    GROUP BY s.id, s.name, cr.name, s.class
    HAVING COALESCE(SUM(d.amount), 0) - COALESCE(SUM(p.amount), 0) > 0
  `;

  // Main query: Get paginated students with dues
  const studentsWithDues = await prismaClient.$queryRaw<TStudentDueSummary[]>`
    SELECT
      s.id AS "studentId",
      s.name AS "studentName",
      s.class AS "classLevel",
      cr.name AS "classroomName",
      COALESCE(SUM(d.amount), 0) - COALESCE(SUM(p.amount), 0) AS "due"
    ${baseQuery}
    ORDER BY s.name
    LIMIT ${limit}
    OFFSET ${skip};
  `;

  // Count query: Get total count for pagination
  const totalCountResult = await prismaClient.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) AS count FROM (
      SELECT s.id
      ${baseQuery}
    ) AS filtered_students;
  `;

  const totalCount = totalCountResult[0]?.count ?? 0;
  const meta = getMeta({ limit, page, total: totalCount });

  return { meta, student: studentsWithDues };
};

export const dueService = { getDuesByClass, getDueByClassroom, getDueByStudent };
