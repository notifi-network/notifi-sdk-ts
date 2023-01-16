import type {
  GetTenantConnectedWalletQuery,
  GetTenantConnectedWalletQueryVariables,
} from '../gql/generated';

export type GetTenantConnectedWalletsService = Readonly<{
  getTenantConnectedWallets: (
    variables: GetTenantConnectedWalletQueryVariables,
  ) => Promise<GetTenantConnectedWalletQuery>;
}>;
