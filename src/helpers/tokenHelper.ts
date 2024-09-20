import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../app/config';

interface IAccessTokenPayload {
  id: string;
  userId: string;
  name: string;
  role: string;
}

export const generateAccessToken = (payload: IAccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

interface IRefreshTokenPayload {
  id: string;
  userId: string;
}

export const generateRefreshToken = (payload: IRefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};
