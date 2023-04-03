import {
  CreateDiscordTargetMutation,
  CreateDiscordTargetMutationVariables,
} from '../gql/generated';

export type CreateDiscordTargetService = Readonly<{
  createDiscordTarget: (
    variables: CreateDiscordTargetMutationVariables,
  ) => Promise<CreateDiscordTargetMutation>;
}>;
