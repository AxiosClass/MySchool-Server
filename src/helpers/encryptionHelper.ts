import bcrypt from 'bcrypt';

export const comparePassword = async (
  givenPassword: string,
  savedPassword: string,
) => {
  return await bcrypt.compare(givenPassword, savedPassword);
};
