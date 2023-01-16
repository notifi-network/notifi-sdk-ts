import {
  LogInFromServiceMutation,
  LogInFromServiceMutationVariables,
} from '../gql/generated';

export type LogInFromServiceService = Readonly<{
  logInFromService: (
    variables: LogInFromServiceMutationVariables,
  ) => Promise<LogInFromServiceMutation>;
}>;
