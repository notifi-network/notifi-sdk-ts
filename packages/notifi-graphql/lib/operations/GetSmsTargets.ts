import type {
  GetSmsTargetsQuery,
  GetSmsTargetsQueryVariables,
} from '../gql/generated';

export type GetSmsTargetsService = Readonly<{
  getSmsTargets: (
    variables: GetSmsTargetsQueryVariables,
  ) => Promise<GetSmsTargetsQuery>;
}>;
