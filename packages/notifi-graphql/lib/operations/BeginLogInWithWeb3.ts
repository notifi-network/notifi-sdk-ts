import {
    BeginLogInWithWeb3Mutation,
    BeginLogInWithWeb3MutationVariables,
  } from '../gql/generated';
  
  export type BeginLogInWithWeb3Service = Readonly<{
    beginLogInWithWeb3: (
      variables: BeginLogInWithWeb3MutationVariables,
    ) => Promise<BeginLogInWithWeb3Mutation>;
  }>;
  