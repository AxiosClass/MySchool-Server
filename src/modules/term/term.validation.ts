import { z } from 'zod';

const addOrUpdateTermSchema = z.object({ name: z.string({ required_error: 'Term name is required' }) });

type TAddOrUpdateTermPayload = z.infer<typeof addOrUpdateTermSchema>;

export const termValidation = { addOrUpdateTermSchema };
export type { TAddOrUpdateTermPayload };
