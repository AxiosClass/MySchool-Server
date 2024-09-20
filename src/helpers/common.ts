export const isValidDate = (date: string) => {
  const dateObject = new Date(date);
  return !isNaN(dateObject.getTime());
};
