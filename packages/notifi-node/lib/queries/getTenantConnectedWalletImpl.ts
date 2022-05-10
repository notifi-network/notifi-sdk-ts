import type { ConnectedWallet, Connection, WalletBlockchain } from '../types';
import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

export type GetTenantConnectedWalletInput = Readonly<{
  input?: Readonly<{
    userWallets: ReadonlyArray<string>;
    userWalletsBlockchain: WalletBlockchain;
  }>;
  first?: number;
  after?: string;
}>;

export type GetTenantConnectedWalletResult = Connection<ConnectedWallet>;

const DEPENDENCIES: string[] = [];

const MUTATION = `
query getTenantConnectedWallet(
  $input: GetTenantConnectedWalletInput
  $first: Int
  $after: String
) {
  tenantConnectedWallet(
    getTenantConnectedWalletInput: $input
    first: $first
  	after: $after
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      address
      walletBlockchain
      user {
        alerts {
          id
          name
          filter {
            id
            name
            filterType
          }
          filterOptions
          groupName
        }
      }
    }
  }
}
`.trim();

const getTenantConnectedWalletImpl = makeAuthenticatedRequest<
  GetTenantConnectedWalletInput,
  GetTenantConnectedWalletResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'tenantConnectedWallet');

export default getTenantConnectedWalletImpl;
