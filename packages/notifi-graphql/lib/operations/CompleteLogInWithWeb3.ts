import {
  CompleteLogInWithWeb3Mutation,
  CompleteLogInWithWeb3MutationVariables,
} from '../gql/generated';

export type CompleteLogInWithWeb3Service = Readonly<{
  completeLogInWithWeb3: (
    variables: CompleteLogInWithWeb3MutationVariables,
  ) => Promise<CompleteLogInWithWeb3Mutation>;
}>;
