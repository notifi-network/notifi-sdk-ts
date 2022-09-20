import type {
  GetWebhookTargetsQuery,
  GetWebhookTargetsQueryVariables,
} from '../gql/generated';

export type GetWebhookTargetsService = Readonly<{
  getWebhookTargets: (
    variables: GetWebhookTargetsQueryVariables,
  ) => Promise<GetWebhookTargetsQuery>;
}>;
