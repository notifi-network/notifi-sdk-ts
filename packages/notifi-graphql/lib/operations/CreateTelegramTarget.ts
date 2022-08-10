import {
  CreateTelegramTargetMutation,
  CreateTelegramTargetMutationVariables,
} from '../gql/generated';

export type CreateTelegramTargetService = Readonly<{
  createTelegramTarget: (
    variables: CreateTelegramTargetMutationVariables,
  ) => Promise<CreateTelegramTargetMutation>;
}>;
