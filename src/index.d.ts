import { IUserInfo } from './utils/types';

declare global {
  namespace Express {
    interface Request {
      user: IUserInfo;
    }
  }
}
