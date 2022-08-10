import {
  CompleteLogInByTransactionMutation,
  CompleteLogInByTransactionMutationVariables,
} from '../gql/generated';

export type CompleteLogInByTransactionService = Readonly<{
  completeLogInByTransaction: (
    variables: CompleteLogInByTransactionMutationVariables,
  ) => Promise<CompleteLogInByTransactionMutation>;
}>;
