import { z } from 'zod';

const addAttendanceSchema = z.object({
  studentId: z.string().min(1, { message: 'Student Id is required' }),
  date: z.string().datetime({ message: 'Invalid date' }).optional(),
});

type TAddAttendancePayload = z.infer<typeof addAttendanceSchema>;

export const attendanceValidation = { addAttendanceSchema };
export { TAddAttendancePayload };
