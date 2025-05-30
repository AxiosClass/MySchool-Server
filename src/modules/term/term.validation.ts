import { z } from 'zod';

const addTermSchema = z.object({ name: z.string({ required_error: 'Term name is required' }) });

type TAddTermPayload = z.infer<typeof addTermSchema>;

export const termValidation = { addTermSchema };
export type { TAddTermPayload };
