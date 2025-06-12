import { SubjectType } from '@prisma/client';
import { TSubjectResult, TTermResultSummary } from './term-result.types';

type TPrepareGradeArgs = Pick<TSubjectResult, 'subjectId' | 'subjectName' | 'componentMarks'> & {
  subjectType: SubjectType;
};

export const getSubjectResult = ({
  subjectId,
  subjectType,
  componentMarks,
  subjectName,
}: TPrepareGradeArgs): TSubjectResult => {
  const schema = {
    CQ_MCQ: { total: 100, pass: 33, utils: { cq: 23, mcq: 10 } },
    CQ_MCQ_PRACTICAL: { total: 100, pass: 33, utils: { cq: 17, mcq: 8, practical: 8 } },
    WRITTEN_FULL: { total: 100, pass: 33 },
    WRITTEN_HALF: { total: 50, pass: 17 },
  };

  const subjectSchema = schema[subjectType as keyof typeof schema];

  const fullMarks = subjectSchema.total;
  const obtainedMarks = Object.values(componentMarks).reduce((acc, mark) => (acc += mark), 0);
  let { grade, gpa } = getGradeAndGpa((obtainedMarks * 100) / fullMarks);

  if ('utils' in subjectSchema) {
    const utils = subjectSchema.utils as Record<string, number>;
    for (const key of Object.keys(componentMarks)) {
      if (componentMarks[key] < utils[key]) {
        grade = 'F';
        gpa = 0;
        break;
      }
    }
  }

  return { subjectId, subjectName, obtainedMarks, fullMarks, gpa, grade, componentMarks };
};

export const getGradeAndGpa = (percentage: number) => {
  if (percentage >= 80) return { grade: 'A+', gpa: 5 };
  if (percentage >= 70) return { grade: 'A', gpa: 4 };
  if (percentage >= 60) return { grade: 'A-', gpa: 3.5 };
  if (percentage >= 50) return { grade: 'B', gpa: 3 };
  if (percentage >= 40) return { grade: 'C', gpa: 2 };
  if (percentage >= 33) return { grade: 'D', gpa: 1 };
  return { grade: 'F', gpa: 0 };
};

type TGenerateGpaForTermArgs = Pick<TTermResultSummary, 'termId' | 'termName' | 'academicYear' | 'subjectResults'>;

export const getTermResultSummary = ({
  termId,
  termName,
  academicYear,
  subjectResults,
}: TGenerateGpaForTermArgs): TTermResultSummary => {
  const totalGpa = subjectResults.reduce((acc, result) => (acc += result.gpa), 0);
  const isFailed = subjectResults.some((result) => !result.gpa);

  const totalSubjects = subjectResults.length;
  const termGPA = isFailed ? 0 : totalGpa / totalSubjects;
  const termGrade = getGradeFromGpa(termGPA);

  return { termId, termName, academicYear, termGPA, termGrade, subjectResults };
};

export const getGradeFromGpa = (gpa: number): string => {
  if (gpa >= 5) return 'A+';
  if (gpa >= 4) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3) return 'B';
  if (gpa >= 2) return 'C';
  if (gpa >= 1) return 'D';
  return 'F';
};
