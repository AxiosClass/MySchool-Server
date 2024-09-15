import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SALT,
} from '../../app/config';

import { IUser, IUserModel } from './interface';
import { model, Schema } from 'mongoose';
import { userRoles, userStatuses } from './constants';

export const userSchema = new Schema<IUser, IUserModel>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  password: { type: String, required: true },
  status: { type: String, enum: userStatuses, default: 'ACTIVE' },
  role: { type: String, enum: userRoles, required: true },
  joinedAt: { type: Date, default: new Date() },
  isDeleted: { type: Boolean, default: false },
  needsPasswordChange: { type: Boolean, default: true },
});

// pre hooks
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(this.password, SALT);
  console.log(hashedPassword);
  this.password = hashedPassword;
  next();
});

// static methods
userSchema.static('verifyAccessToken', function (accessToken: string) {
  return jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
});

// instance method
userSchema.method('comparePassword', async function (givenPassword: string) {
  return await bcrypt.compare(givenPassword, this.password);
});

userSchema.method('generateAccessToken', function () {
  const { _id, userId, name, role, image } = this;
  return jwt.sign({ _id, userId, name, role, image }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
});

userSchema.method('generateRefreshToken', function () {
  const { _id, userId } = this;
  return jwt.sign({ _id, userId }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
});

export const User = model<IUser, IUserModel>('user', userSchema);
