export const normalizeHexString = (input: string): string => {
  let result = input;
  if (input !== '') {
    result = input.toLowerCase();
    if (!result.startsWith('0x')) {
      result = '0x' + result;
    }
  }
  return result;
};
