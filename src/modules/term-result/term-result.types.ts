export type TTermResultSummary = {
  termId: string;
  termName: string;
  academicYear: string;
  classInfo: { name: string; level: string };
  termGPA: number;
  termGrade: string;
  subjectResults: TSubjectResult[];
};

export type TSubjectResult = {
  subjectId: string;
  subjectName: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  componentMarks: Record<string, { obtained: number; total: number }>;
};
