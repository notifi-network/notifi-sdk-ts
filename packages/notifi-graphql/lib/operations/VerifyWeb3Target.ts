import {
  VerifyWeb3TargetMutation,
  VerifyWeb3TargetMutationVariables,
} from '../gql/generated';

export type VerifyWeb3TargetService = Readonly<{
  verifyWeb3Target: (
    variables: VerifyWeb3TargetMutationVariables,
  ) => Promise<VerifyWeb3TargetMutation>;
}>;
