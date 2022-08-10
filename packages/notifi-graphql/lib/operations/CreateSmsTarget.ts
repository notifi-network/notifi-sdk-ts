import {
  CreateSmsTargetMutation,
  CreateSmsTargetMutationVariables,
} from '../gql/generated';

export type CreateSmsTargetService = Readonly<{
  createSmsTarget: (
    variables: CreateSmsTargetMutationVariables,
  ) => Promise<CreateSmsTargetMutation>;
}>;
