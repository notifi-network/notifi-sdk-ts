import { parsePhoneNumber } from 'libphonenumber-js';

type PhoneData = {
  countryCallingCode: string;
  baseNumber: string;
};

export const splitPhoneNumber = (phoneNumber: string): PhoneData => {
  const { countryCallingCode, nationalNumber: baseNumber } =
    parsePhoneNumber(phoneNumber);
  if (!countryCallingCode || !baseNumber) {
    throw new Error('No country or phone found');
  }

  return { baseNumber, countryCallingCode };
};

export const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    throw new Error('No phone data found!');
  }

  return parsePhoneNumber(phoneNumber)
    .formatInternational()
    .replaceAll(' ', '-');
};
