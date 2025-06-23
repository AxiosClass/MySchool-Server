export type TFinanceReport = { totalDue: number; totalPaid: number; totalDiscount: number };

export type TStudentDueSummary = {
  studentId: string;
  studentName: string;
  classLevel: string;
  classroomName: string;
  due: number;
};
