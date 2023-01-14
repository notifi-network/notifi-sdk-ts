import type { Types } from '@notifi-network/notifi-graphql';

export type GetTenantConnectedWalletResult = Exclude<
  Types.GetTenantConnectedWalletQuery['tenantConnectedWallet'],
  undefined
>;
