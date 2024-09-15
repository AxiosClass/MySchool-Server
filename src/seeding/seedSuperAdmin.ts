import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../modules/user/model';
import { MONGO_URI, SALT } from '../app/config';
import { ADMIN_ID, ADMIN_PASSWORD } from '../app/config';

export const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI!);
    // is super admin exist don't create another one
    const isSuperAdminExist = await User.findOne({ role: 'SUPER_ADMIN' });
    if (isSuperAdminExist) throw new Error('Super admin already exist');
    const password = await bcrypt.hash(ADMIN_PASSWORD, SALT);

    // creating super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      password,
      role: 'SUPER_ADMIN',
      userId: ADMIN_ID,
      needsPasswordChange: false,
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
  } finally {
    await mongoose.disconnect();
  }
};

seedSuperAdmin();
