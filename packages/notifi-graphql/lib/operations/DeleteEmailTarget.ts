import {
  DeleteEmailTargetMutation,
  DeleteEmailTargetMutationVariables,
} from '../gql/generated';

export type DeleteEmailTargetService = Readonly<{
  deleteEmailTarget: (
    variables: DeleteEmailTargetMutationVariables,
  ) => Promise<DeleteEmailTargetMutation>;
}>;
