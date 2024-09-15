import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const SALT = Number(process.env.SALT);
export const ADMIN_ID = process.env.ADMIN_ID;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
