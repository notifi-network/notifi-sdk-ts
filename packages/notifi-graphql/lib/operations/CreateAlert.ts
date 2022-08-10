import {
  CreateAlertMutation,
  CreateAlertMutationVariables,
} from '../gql/generated';

export type CreateAlertService = Readonly<{
  createAlert: (
    variables: CreateAlertMutationVariables,
  ) => Promise<CreateAlertMutation>;
}>;
