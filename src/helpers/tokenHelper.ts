import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../app/config';
import { IAccessTokenPayload } from '../utils/types';

export const generateAccessToken = (payload: IAccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as IAccessTokenPayload;
};
