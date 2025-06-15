import { z } from 'zod';

const addClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Class Name is required' })
    .regex(/^[a-zA-Z\s-]+$/, {
      message: 'Class name must contain only letters, numbers, spaces, or hyphens',
    }),

  level: z.string().trim().min(1, { message: 'Level is required' }),

  monthlyFee: z
    .number({
      required_error: 'Monthly fee is required',
      invalid_type_error: 'Monthly fee must be a number',
    })
    .min(0, { message: 'Monthly fee must be at least 0' }),

  termFee: z
    .number({
      required_error: 'Term fee is required',
      invalid_type_error: 'Term fee must be a number',
    })
    .min(0, { message: 'Term fee must be at least 0' }),

  admissionFee: z
    .number({
      required_error: 'Admission fee is required',
      invalid_type_error: 'Admission fee must be a number',
    })
    .min(0, { message: 'Admission fee must be at least 0' }),
});

const updateClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Class Name is required' })
    .regex(/^[a-zA-Z\s-]+$/, {
      message: 'Class name must contain only letters, numbers, spaces, or hyphens',
    })
    .optional(),

  level: z.string().trim().min(1, { message: 'Level is required' }).optional(),

  monthlyFee: z
    .number({
      required_error: 'Monthly fee is required',
      invalid_type_error: 'Monthly fee must be a number',
    })
    .min(0, { message: 'Monthly fee must be at least 0' })
    .optional(),

  termFee: z
    .number({
      required_error: 'Term fee is required',
      invalid_type_error: 'Term fee must be a number',
    })
    .min(0, { message: 'Term fee must be at least 0' })
    .optional(),

  admissionFee: z
    .number({
      required_error: 'Admission fee is required',
      invalid_type_error: 'Admission fee must be a number',
    })
    .min(0, { message: 'Admission fee must be at least 0' })
    .optional(),
});

export const assignClassSubjectsSchema = z.object({
  subjectIds: z
    .array(z.string().trim().min(1, { message: 'Each Subject ID must be a non-empty string' }))
    .min(1, { message: 'You must assign at least one subject' }),

  classId: z.string().uuid({ message: 'Class ID must be a valid UUID' }),
});

type TAddClassPayload = z.infer<typeof addClassSchema>;
type TUpdateClassPayload = z.infer<typeof updateClassSchema>;
type TAssignClassSubjectsPayload = z.infer<typeof assignClassSubjectsSchema>;

export const classValidation = { addClassSchema, updateClassSchema, assignClassSubjectsSchema };
export { TAddClassPayload, TUpdateClassPayload, TAssignClassSubjectsPayload };
