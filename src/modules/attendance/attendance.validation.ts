import { z } from 'zod';

const addAttendanceSchema = z.object({
  studentId: z.string().min(1, { message: 'Student Id is required' }),
  date: z.string().datetime({ message: 'Invalid date' }).optional(),
});

const addAttendanceFormNfcSchema = z.object({ cardId: z.string().min(1, 'Card Id is required') });

type TAddAttendancePayload = z.infer<typeof addAttendanceSchema>;
type TAddAttendanceFromNfcPayload = z.infer<typeof addAttendanceFormNfcSchema>;

export const attendanceValidation = { addAttendanceSchema, addAttendanceFormNfcSchema };
export { TAddAttendancePayload, TAddAttendanceFromNfcPayload };
