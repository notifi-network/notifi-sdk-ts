import {
  GetVapidPublicKeysQuery,
  GetVapidPublicKeysQueryVariables,
} from '../gql/generated';

export type GetVapidPublicKeysService = Readonly<{
  getVapidPublicKeys: (
    variables: GetVapidPublicKeysQueryVariables,
  ) => Promise<GetVapidPublicKeysQuery>;
}>;
