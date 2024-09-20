export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ISuccessResponse {
  message: string;
  meta?: IMeta;
  data: unknown;
}

export interface IErrorResponse {
  status: number;
  message: string;
  error: unknown;
}
