import {
  VerifyCbwTargetMutation,
  VerifyCbwTargetMutationVariables,
} from '../gql/generated';

export type VerifyCbwTargetService = Readonly<{
  verifyCbwTarget: (
    variables: VerifyCbwTargetMutationVariables,
  ) => Promise<VerifyCbwTargetMutation>;
}>;
