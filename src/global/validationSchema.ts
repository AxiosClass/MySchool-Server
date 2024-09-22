import { z } from 'zod';
import { enumGenerator } from '../helpers';
import { divisions } from './constants';

export const addressSubSchema = z.object(
  {
    division: enumGenerator(divisions, 'Invalid Division'),
    district: z
      .string({ required_error: 'District is required' })
      .min(1, { message: 'District is required' }),
    subDistrict: z
      .string({ required_error: 'SubDistrict is required' })
      .min(1, { message: 'Sub District is required' }),
    postCode: z.string().optional(),
    village: z.string().optional(),
    streetAddress: z.string().optional(),
  },
  { required_error: 'Address is required' },
);
