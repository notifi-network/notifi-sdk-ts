import {
  CreateDirectPushAlertMutation,
  CreateDirectPushAlertMutationVariables,
} from '../gql/generated';

export type CreateDirectPushAlertService = Readonly<{
  createDirectPushAlert: (
    variables: CreateDirectPushAlertMutationVariables,
  ) => Promise<CreateDirectPushAlertMutation>;
}>;
