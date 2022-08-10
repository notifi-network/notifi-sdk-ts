import type {
  GetTelegramTargetsQuery,
  GetTelegramTargetsQueryVariables,
} from '../gql/generated';

export type GetTelegramTargetsService = Readonly<{
  getTelegramTargets: (
    variables: GetTelegramTargetsQueryVariables,
  ) => Promise<GetTelegramTargetsQuery>;
}>;
