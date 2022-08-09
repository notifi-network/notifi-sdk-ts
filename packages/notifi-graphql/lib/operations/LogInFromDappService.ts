import {
  LogInFromDappMutation,
  LogInFromDappMutationVariables,
} from '../gql/generated';

export type LogInFromDappService = Readonly<{
  logInFromDapp: (
    variables: LogInFromDappMutationVariables,
  ) => Promise<LogInFromDappMutation>;
}>;
