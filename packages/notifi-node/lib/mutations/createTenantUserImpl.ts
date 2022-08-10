import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

import type { WalletBlockchain } from '../types';

export type CreateTenantUserInput = Readonly<{
  input: Readonly<{
    walletBlockchain: WalletBlockchain;
    walletPublicKey: string;
  }>;
}>;

export type CreateTenantUserResult = Readonly<{
  id: string;
}>;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation createTenantUser($input: CreateTenantUserInput!) {
  createTenantUser(createTenantUserInput: $input) {
    id
  }
}
`.trim();

const createTenantUserImpl = makeAuthenticatedRequest<
  CreateTenantUserInput,
  CreateTenantUserResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createTenantUser');

export default createTenantUserImpl;
