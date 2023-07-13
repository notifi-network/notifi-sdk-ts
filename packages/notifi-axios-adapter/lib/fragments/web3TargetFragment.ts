export const web3TargetFragment = `
fragment smsTargetFragment on SmsTarget {
  id
  isConfirmed
  targetProtocol
  walletBlockchain
  name
}
`.trim();

export const web3TargetFragmentDependencies = [];
