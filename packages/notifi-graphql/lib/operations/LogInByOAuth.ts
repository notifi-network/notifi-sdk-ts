// TODO: Remove this export after Oidc migration
import {
  LogInByOAuthMutation,
  LogInByOAuthMutationVariables,
} from '../gql/generated';

export type LogInByOAuthService = Readonly<{
  logInByOAuth: (
    variables: LogInByOAuthMutationVariables,
  ) => Promise<LogInByOAuthMutation>;
}>;
