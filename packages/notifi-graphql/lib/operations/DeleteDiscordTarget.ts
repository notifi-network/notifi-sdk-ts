import {
  DeleteDiscordTargetMutation,
  DeleteDiscordTargetMutationVariables,
} from '../gql/generated';

export type DeleteDiscordTargetService = Readonly<{
  deleteDiscordTarget: (
    variables: DeleteDiscordTargetMutationVariables,
  ) => Promise<DeleteDiscordTargetMutation>;
}>;
