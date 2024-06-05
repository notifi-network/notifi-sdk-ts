export const reformatSignatureForWalletTarget = (
  signature: Uint8Array | string,
) => {
  if (!signature) return '';

  let hexString = '0x';

  Object.values(signature).forEach(
    (v) => (hexString += v.toString(16).padStart(2, '0')),
  );

  return hexString;
};
