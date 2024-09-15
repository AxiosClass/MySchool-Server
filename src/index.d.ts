import { IUser } from './modules/user/interface';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
