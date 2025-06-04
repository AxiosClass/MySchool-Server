import { TermStatus } from '@prisma/client';
import { z } from 'zod';

const addOrUpdateTermSchema = z.object({ name: z.string({ required_error: 'Term name is required' }) });
const updateStatusSchema = z.object({ status: z.nativeEnum(TermStatus, { message: 'Invalid status' }) });

type TAddOrUpdateTermPayload = z.infer<typeof addOrUpdateTermSchema>;
type TUpdateStatusPayload = z.infer<typeof updateStatusSchema>;

export const termValidation = { addOrUpdateTermSchema, updateStatusSchema };
export type { TAddOrUpdateTermPayload, TUpdateStatusPayload };
