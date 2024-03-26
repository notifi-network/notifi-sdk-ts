import {
  CreateFusionAlertsMutation,
  CreateFusionAlertsMutationVariables,
} from '../gql/generated';

export type CreateFusionAlertsService = Readonly<{
  createFusionAlerts: (
    variables: CreateFusionAlertsMutationVariables,
  ) => Promise<CreateFusionAlertsMutation>;
}>;
