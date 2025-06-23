export type TFinanceReport = { totalDue: number; totalPaid: number };

export type TStudentDueSummary = {
  studentId: string;
  studentName: string;
  classLevel: string;
  classroomName: string;
  due: number;
};
