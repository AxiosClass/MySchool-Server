import moment from 'moment';
import { IMeta, TObject } from '../utils/types';
import { number } from 'zod';

// ***** Check Valid date ***** \\
export const isValidDate = (date: string) => {
  const dateObject = new Date(date);
  return !isNaN(dateObject.getTime());
};

// ***** Generate Random Characters ***** \\
const chars = 'abcdefghijklmnopqrstuv0123456789';
export const generateRandomCharacters = (len: number) => {
  let char = '';
  for (let i = 1; i <= len; i++) {
    const index = Math.ceil(Math.random() * chars.length);
    char += chars[index];
  }

  return char;
};

// ***** Calculate months between ***** \\
export const calculateMonthsBetween = (startDate: Date, endDate: Date) => {
  if (startDate > endDate) {
    throw new Error('Start date must be before end date.');
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const yearDifference = endYear - startYear;
  const monthDifference = endMonth - startMonth + 1;

  return yearDifference * 12 + monthDifference;
};

// ***** Remove EmptyProperties ***** \\
export const removeEmptyProperties = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});
};

// ***** Exact Match Picker ***** \\
export const exactMatchPicker = (keys: string[], obj: Record<string, any>) => {
  const refinedObj = removeEmptyProperties(obj);
  return Object.keys(refinedObj).reduce((acc: Record<string, any>, key) => {
    if (keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

// ***** Partial Match Picker ***** \\
export const partialMatchPicker = (keys: string[], obj: Record<string, any>) => {
  const refinedObj = removeEmptyProperties(obj);
  return Object.keys(refinedObj).reduce((acc: Record<string, any>, key) => {
    if (keys.includes(key)) acc[key] = { contains: obj[key], mode: 'insensitive' };
    return acc;
  }, {});
};

// ***** Pagination Property Generator ***** \\
export const paginationPropertyGenerator = (query: TObject) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  return { skip, limit, page };
};

// ***** Meta Generator ***** \\
type TMetaGenerator = (args: Pick<IMeta, 'limit' | 'page' | 'total'>) => IMeta;
export const metaGenerator: TMetaGenerator = ({ page, limit, total }) => {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
};

// ***** Generate Date Array ***** \\
type TGenerateDateArrayArgs = { start: Date; end: Date };
export const generateDateArray = ({ start, end }: TGenerateDateArrayArgs) => {
  const dateArray = [];
  let currentDate = moment(start).clone();

  while (currentDate.isSameOrBefore(end, 'day')) {
    dateArray.push(currentDate.toDate());
    currentDate.add(1, 'day');
  }

  return dateArray;
};

// ***** Generate HalfYear Array ***** \\
export const generateHalfYearArray = () => {
  const date = moment(new Date());
  const month = date.month();
  const year = date.year();
  const formatStr = 'MMM YYYY';
  const isFirst = month >= 0 && month <= 5;
  const start = isFirst ? 0 : 6;
  const end = start + 6;

  const months = [];

  for (let i = start; i < end; i++) {
    const monthFormatted = moment().month(i).year(year).format(formatStr);
    months.push(monthFormatted);
  }

  return months;
};

// ***** Generate HalfYearly Date Range ***** \\
export const generateHalfYearlyDateRange = () => {
  const date = moment(new Date());
  const month = date.month();
  const isFirst = month >= 0 && month <= 5;
  const start = isFirst ? date.startOf('year').toDate() : date.month(6).startOf('month').toDate();
  const end = isFirst ? date.month(5).endOf('month').toDate() : date.endOf('year').toDate();

  return { start, end };
};

// ***** Generates Date Form A String ***** \\
export const parseDate = (date: string) => {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

// ****** Generate Meta ********* \\
export const getPaginationInfo = (query: TObject) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const getAll = query.getAll === 'true';

  const skip = (page - 1) * limit;

  return { page, limit, skip, getAll };
};

export const getMeta = ({ page, limit, total }: Pick<IMeta, 'page' | 'limit' | 'total'>): IMeta => {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
};
