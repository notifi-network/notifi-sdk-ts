import {
  DeleteTelegramTargetMutation,
  DeleteTelegramTargetMutationVariables,
} from '../gql/generated';

export type DeleteTelegramTargetService = Readonly<{
  deleteTelegramTarget: (
    variables: DeleteTelegramTargetMutationVariables,
  ) => Promise<DeleteTelegramTargetMutation>;
}>;
