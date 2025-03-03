import {
  DeleteSlackChannelTargetMutation,
  DeleteSlackChannelTargetMutationVariables,
} from '../gql/generated';

export type DeleteSlackChannelTargetService = Readonly<{
  deleteSlackChannelTarget: (
    variables: DeleteSlackChannelTargetMutationVariables,
  ) => Promise<DeleteSlackChannelTargetMutation>;
}>;
