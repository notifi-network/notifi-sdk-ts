import { userFragment } from "./userFragment";
export const completeLogInByTransactionFragment = `
fragment completeLogInByTransactionFragment on CompleteLogInByTransactionResult {
  ...userFragment
}
`.trim();

export const completeLogInByTransactionFragmentDependencies = [
  userFragment,
  completeLogInByTransactionFragment,
];
