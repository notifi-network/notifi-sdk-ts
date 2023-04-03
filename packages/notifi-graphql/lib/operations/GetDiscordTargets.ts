import type {
  GetDiscordTargetsQuery,
  GetDiscordTargetsQueryVariables,
} from '../gql/generated';

export type GetDiscordTargetsService = Readonly<{
  getDiscordTargets: (
    variables: GetDiscordTargetsQueryVariables,
  ) => Promise<GetDiscordTargetsQuery>;
}>;
