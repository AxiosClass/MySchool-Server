const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const characterLength = characters.length;

export const generateRandomCharacter = (length: number) => {
  let key = '';
  for (let i = 1; i <= length; i++) {
    key += characters[Math.floor(Math.random() * characterLength)];
  }
  return key;
};

export const generatePaymentId = () => {
  let paymentId = 'P-';
  paymentId += generateRandomCharacter(3);
  paymentId += '-';
  for (let i = 1; i <= 6; i++) {
    paymentId += Math.floor(Math.random() * 10);
  }

  return paymentId;
};
