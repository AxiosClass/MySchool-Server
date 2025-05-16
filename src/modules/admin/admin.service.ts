import { generateMailOption, generatePasseordEmailTemplate, transporter } from '../../helpers/email-helper';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { generateRandomCharacters } from '../../helpers/common';
import { encryptPassword } from '../../helpers/encryptionHelper';
import { TCreateAdminPayload } from './admin.validation';

const createAdmin = async (payload: TCreateAdminPayload) => {
  const isAdminExists = await prismaClient.admin.findUnique({ where: { id: payload.email }, select: { id: true } });
  if (isAdminExists) throw new AppError('Admin already exists', 400);

  const password = generateRandomCharacters(4);
  const hashPassword = await encryptPassword(password);

  const admin = await prismaClient.admin.create({
    data: { id: payload.email, name: payload.name, role: payload.role, password: hashPassword },
    select: { id: true },
  });

  if (!admin) throw new AppError('Failed to create admin', 500);

  try {
    const response = await transporter.sendMail({
      ...generateMailOption(payload.email),
      subject: 'You account has been created',
      text: `Your passsword is ${password}\nDo not share this with other`,
      html: generatePasseordEmailTemplate(password),
    });

    if (!response.accepted) throw new AppError('Failed to send email', 500);

    return 'Account has been created';
  } catch (error) {
    console.log({ error });
    return `Account has been created\nFailed to send Email\nPassword:${password}`;
  }
};

const deleteAdmin = async (email: string) => {
  const isAdminExist = await prismaClient.admin.findUnique({ where: { id: email }, select: { id: true } });
  if (!isAdminExist) throw new AppError('Admin not found', 404);

  await prismaClient.admin.delete({ where: { id: email } });
  return 'Admin Deleted Successfully';
};

export const adminService = { createAdmin, deleteAdmin };
