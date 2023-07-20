import {
  CreateWeb3TargetMutation,
  CreateWeb3TargetMutationVariables,
} from '../gql/generated';

export type CreateWeb3TargetService = Readonly<{
  createWeb3Target: (
    variables: CreateWeb3TargetMutationVariables,
  ) => Promise<CreateWeb3TargetMutation>;
}>;
