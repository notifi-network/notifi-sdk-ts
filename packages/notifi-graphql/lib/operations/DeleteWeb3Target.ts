import {
  DeleteWeb3TargetMutation,
  DeleteWeb3TargetMutationVariables,
} from '../gql/generated';

export type DeleteWeb3TargetService = Readonly<{
  deleteWeb3Target: (
    variables: DeleteWeb3TargetMutationVariables,
  ) => Promise<DeleteWeb3TargetMutation>;
}>;
