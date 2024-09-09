import {
  LogInByOidcMutation,
  LogInByOidcMutationVariables,
} from '../gql/generated';

export type LogInByOidcService = Readonly<{
  logInByOidc: (
    variables: LogInByOidcMutationVariables,
  ) => Promise<LogInByOidcMutation>;
}>;
