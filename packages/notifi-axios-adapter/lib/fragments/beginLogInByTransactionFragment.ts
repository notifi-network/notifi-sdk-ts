export const beginLogInByTransactionFragment = `
fragment beginLogInByTransactionFragment on BeginLogInByTransactionResult {
  nonce
}
`.trim();

export const beginLogInByTransactionFragmentDependencies = [
  beginLogInByTransactionFragment,
];
