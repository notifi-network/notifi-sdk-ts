import {
  BroadcastMessageMutation,
  BroadcastMessageMutationVariables,
} from '../gql/generated';

export type BroadcastMessageService = Readonly<{
  broadcastMessage: (
    variables: BroadcastMessageMutationVariables,
  ) => Promise<BroadcastMessageMutation>;
}>;
