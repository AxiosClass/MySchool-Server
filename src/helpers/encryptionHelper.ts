import bcrypt from 'bcrypt';
import { SALT } from '../app/config';

export const comparePassword = async (givenPassword: string, savedPassword: string) => {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT);
};
