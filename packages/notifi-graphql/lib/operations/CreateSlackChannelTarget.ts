import {
  CreateSlackChannelTargetMutation,
  CreateSlackChannelTargetMutationVariables,
} from '../gql/generated';

export type CreateSlackChannelTargetService = Readonly<{
  createSlackChannelTarget: (
    variables: CreateSlackChannelTargetMutationVariables,
  ) => Promise<CreateSlackChannelTargetMutation>;
}>;
