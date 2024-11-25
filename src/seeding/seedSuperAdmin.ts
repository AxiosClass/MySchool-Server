import { AdminRole } from '@prisma/client';
import { encryptPassword } from '../helpers/encryptionHelper';
import { ADMIN_ID, ADMIN_PASSWORD } from '../app/config';
import { prismaClient } from '../app/prisma';

export const seedSuperAdmin = async () => {
  try {
    // first checking if super admin exists or not
    const isSuperAdminExist = await prismaClient.admin.findFirst({
      where: { role: AdminRole.SUPER_ADMIN },
    });

    if (isSuperAdminExist) throw new Error('Super Admin already exist');

    // create super admin
    const password = await encryptPassword(ADMIN_PASSWORD!);
    const superAdmin = await prismaClient.admin.create({
      data: { id: ADMIN_ID!, name: 'SuperAdmin', password, role: AdminRole.SUPER_ADMIN, needPasswordChange: false },
    });

    if (!superAdmin) throw new Error('Failed to create super admin, try again later');

    console.log('************* Success *************');
    console.log('UserId :', ADMIN_ID);
    console.log('Password :', ADMIN_PASSWORD);
    console.log('************* Success *************');
  } catch (error: any) {
    console.log('************* ERROR *************');
    console.log('Error :', error.message);
    console.log('************* ERROR *************');
  }
};

seedSuperAdmin();
