import {
  GetConnectedWalletsQuery,
  GetConnectedWalletsQueryVariables,
} from '../gql/generated';

export type GetConnectedWalletsService = Readonly<{
  getConnectedWallets: (
    variables: GetConnectedWalletsQueryVariables,
  ) => Promise<GetConnectedWalletsQuery>;
}>;
