export const isValidDate = (date: string) => {
  const dateObject = new Date(date);
  return !isNaN(dateObject.getTime());
};

const chars = ['abcdefghijklmnopqrstuv0123456789'];
export const generateRandomCharacters = (len: number) => {
  let char = '';
  for (let i = 1; i <= len; i++) {
    const index = Math.ceil(Math.random() * chars.length);
    char = chars[index];
  }

  return char;
};

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
