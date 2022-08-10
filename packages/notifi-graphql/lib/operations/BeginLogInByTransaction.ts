import {
  BeginLogInByTransactionMutation,
  BeginLogInByTransactionMutationVariables,
} from '../gql/generated';

export type BeginLogInByTransactionService = Readonly<{
  beginLogInByTransaction: (
    variables: BeginLogInByTransactionMutationVariables,
  ) => Promise<BeginLogInByTransactionMutation>;
}>;
