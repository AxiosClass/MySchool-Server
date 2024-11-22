export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ISuccessResponse {
  message: string;
  status?: number;
  meta?: IMeta;
  data: unknown;
}

export interface IErrorResponse {
  status: number;
  message: string;
  error: unknown;
}

export interface IAccessTokenPayload {
  id: string;
  role: USER_ROLES;
  name: string;
  image?: string;
}

export enum USER_ROLES {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}
