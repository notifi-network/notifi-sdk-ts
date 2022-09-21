import {
  RefreshAuthorizationMutation,
  RefreshAuthorizationMutationVariables,
} from '../gql/generated';

export type RefreshAuthorizationService = Readonly<{
  refreshAuthorization: (
    variables: RefreshAuthorizationMutationVariables,
  ) => Promise<RefreshAuthorizationMutation>;
}>;
