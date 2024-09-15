import { JwtPayload } from 'jsonwebtoken';
import { Model, Schema } from 'mongoose';

export type TStatus = 'ACTIVE' | 'BLOCKED';
export type TRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ACCOUNTANT'
  | 'TEACHER'
  | 'STUDENT';

export interface IUser {
  _id: Schema.Types.ObjectId;
  userId: string;
  name: string;
  image?: string;
  password: string;
  status: TStatus;
  role: TRole;
  joinedAt: Date;
  isDeleted: boolean;
  needsPasswordChange: boolean;

  // instance method
  comparePassword(givenPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel extends Model<IUser> {
  verifyAccessToken(accessToken: string): JwtPayload;
}
