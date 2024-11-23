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
