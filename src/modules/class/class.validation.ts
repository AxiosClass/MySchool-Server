import { z } from 'zod';

const addClassSchema = z.object({
  name: z
    .string({ required_error: 'Class Name is required' })
    .min(1, { message: 'Class Name is required' }),
  level: z
    .number({ required_error: 'Level is required' })
    .min(1, { message: 'Level is required' }),
});

export const classValidation = { addClassSchema };

// export const addOrRemoveSubjects = z.object({
//   subjects: z
//     .array(
//       z
//         .string({ required_error: 'Subject is required' })
//         .min(1, { message: 'Subject is required' }),
//     )
//     .min(1, { message: 'Subjects is required' }),
// });

// export const addSection = z.object({
//   name: z
//     .string({ required_error: 'Section name is required' })
//     .min(1, { message: 'Section name is required' }),
//   teacherId: z
//     .string({ required_error: 'TeacherId is required' })
//     .min(1, { message: 'TeacherId is required' }),
// });

// export const assignSubjectTeacher = z.object({
//   name: z
//     .string({ required_error: 'Subject name is required' })
//     .min(1, { message: 'Subject Name is required' }),
//   teacherId: z
//     .string({ required_error: 'TeacherId is required' })
//     .min(1, { message: 'TeacherId is required' }),
// });

export type TAddClassPayload = z.infer<typeof addClassSchema>;
// export type TAddOrRemoveSubjectsPayload = z.infer<typeof addOrRemoveSubjects>;
// export type TAddSectionPayload = z.infer<typeof addSection>;
// export type TAssignSubjectTeacherPayload = z.infer<typeof assignSubjectTeacher>;
