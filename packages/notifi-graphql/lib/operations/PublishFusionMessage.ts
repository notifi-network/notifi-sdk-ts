import {
  PublishFusionMessageMutation,
  PublishFusionMessageMutationVariables,
} from '../gql/generated';

export type PublishFusionMessageService = Readonly<{
  publishFusionMessage: (
    variables: PublishFusionMessageMutationVariables,
  ) => Promise<PublishFusionMessageMutation>;
}>;
