import {
  DeleteSmsTargetMutation,
  DeleteSmsTargetMutationVariables,
} from '../gql/generated';

export type DeleteSmsTargetService = Readonly<{
  deleteSmsTarget: (
    variables: DeleteSmsTargetMutationVariables,
  ) => Promise<DeleteSmsTargetMutation>;
}>;
