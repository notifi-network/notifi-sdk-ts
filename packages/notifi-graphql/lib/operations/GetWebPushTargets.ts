import {
  GetWebPushTargetsQuery,
  GetWebPushTargetsQueryVariables,
} from '../gql/generated';

export type GetWebPushTargetsService = Readonly<{
  getWebPushTargets: (
    variables: GetWebPushTargetsQueryVariables,
  ) => Promise<GetWebPushTargetsQuery>;
}>;
