import { IMeta } from '../utils/types';

// ***** Check Valid date ***** \\
export const isValidDate = (date: string) => {
  const dateObject = new Date(date);
  return !isNaN(dateObject.getTime());
};

// ***** Generate Random Characters ***** \\
const chars = ['abcdefghijklmnopqrstuv0123456789'];
export const generateRandomCharacters = (len: number) => {
  let char = '';
  for (let i = 1; i <= len; i++) {
    const index = Math.ceil(Math.random() * chars.length);
    char = chars[index];
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

// ***** Meta Generator ***** \\
export const metaGenerator = ({ page, limit, total }: Pick<IMeta, 'page' | 'limit' | 'total'>): IMeta => {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
};
