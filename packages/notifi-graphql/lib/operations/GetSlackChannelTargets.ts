import type {
  GetSlackChannelTargetsQuery,
  GetSlackChannelTargetsQueryVariables,
} from '../gql/generated';

export type GetSlackChannelTargetsService = Readonly<{
  getSlackChannelTargets: (
    variables: GetSlackChannelTargetsQueryVariables,
  ) => Promise<GetSlackChannelTargetsQuery>;
}>;
