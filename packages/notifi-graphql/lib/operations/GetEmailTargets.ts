import type {
  GetEmailTargetsQuery,
  GetEmailTargetsQueryVariables,
} from '../gql/generated';

export type GetEmailTargetsService = Readonly<{
  getEmailTargets: (
    variables: GetEmailTargetsQueryVariables,
  ) => Promise<GetEmailTargetsQuery>;
}>;
