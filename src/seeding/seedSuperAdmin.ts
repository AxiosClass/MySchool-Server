import { ADMIN_ID, ADMIN_PASSWORD } from '../app/config';
import { prismaClient } from '../app/prisma';
import { encryptPassword } from '../helpers';
import { UserRole } from '@prisma/client';

export const seedSuperAdmin = async () => {
  try {
    // is super admin exist don't create another one
    const isSuperAdminExist = await prismaClient.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });
    if (isSuperAdminExist) throw new Error('Super admin already exist');

    // encrypting password
    const password = await encryptPassword(ADMIN_PASSWORD);

    // creating super admin
    const superAdmin = await prismaClient.user.create({
      data: {
        name: 'Super Admin',
        password,
        role: UserRole.ADMIN,
        userId: ADMIN_ID,
        needPasswordChange: false,
      },
    });

    if (!superAdmin) throw Error('Failed to create super admin');

    console.log('************* START *************');
    console.log('UserId :', ADMIN_ID);
    console.log('Password :', ADMIN_PASSWORD);
    console.log('************* END *************');
  } catch (error) {
    console.log('************* ERROR *************');
    console.log('Error :', error.message);
    console.log('************* END *************');
  }
};

seedSuperAdmin();
