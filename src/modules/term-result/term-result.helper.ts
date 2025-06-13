import { SubjectType } from '@prisma/client';
import { TSubjectResult, TTermResultSummary } from './term-result.types';

type TPrepareGradeArgs = Pick<TSubjectResult, 'subjectId' | 'subjectName'> & {
  subjectType: SubjectType;
  marks: Record<string, number>;
};

export const getSubjectResult = ({ subjectId, subjectType, marks, subjectName }: TPrepareGradeArgs): TSubjectResult => {
  const schema = {
    CQ_MCQ: { total: 100, pass: 33, utils: { cq: 23, mcq: 10 }, components: { cq: 70, mcq: 30 } },
    CQ_MCQ_PRACTICAL: {
      total: 100,
      pass: 33,
      utils: { cq: 17, mcq: 8, practical: 8 },
      components: { cq: 50, mcq: 25, practical: 25 },
    },
    WRITTEN_FULL: { total: 100, pass: 33, components: { written: 100 } },
    WRITTEN_HALF: { total: 50, pass: 17, components: { written: 50 } },
  };

  const subjectSchema = schema[subjectType as keyof typeof schema];

  const fullMarks = subjectSchema.total;
  const componentMarks: TSubjectResult['componentMarks'] = {};
  let obtainedMarks = 0;

  Object.keys(marks).forEach((key) => {
    obtainedMarks += marks[key];
    componentMarks[key] = {
      total: subjectSchema.components[key as keyof typeof subjectSchema.components],
      obtained: marks[key],
    };
  });

  // const obtainedMarks = Object.values(marks).reduce((acc, mark) => (acc += mark), 0);.
  let { grade, gpa } = getGradeAndGpa((obtainedMarks * 100) / fullMarks);

  if ('utils' in subjectSchema) {
    const utils = subjectSchema.utils as Record<string, number>;
    for (const key of Object.keys(marks)) {
      if (marks[key] < utils[key]) {
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

type TGenerateGpaForTermArgs = Pick<
  TTermResultSummary,
  'termId' | 'termName' | 'academicYear' | 'subjectResults' | 'classInfo'
>;

export const getTermResultSummary = ({
  termId,
  termName,
  academicYear,
  subjectResults,
  classInfo,
}: TGenerateGpaForTermArgs): TTermResultSummary => {
  const totalGpa = subjectResults.reduce((acc, result) => (acc += result.gpa), 0);
  const isFailed = subjectResults.some((result) => !result.gpa);

  const totalSubjects = subjectResults.length;
  const termGPA = isFailed ? 0 : totalGpa / totalSubjects;
  const termGrade = getGradeFromGpa(termGPA);

  return { termId, termName, academicYear, classInfo, termGPA, termGrade, subjectResults };
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
