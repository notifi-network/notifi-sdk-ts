import {
  RemoveSourceFromSourceGroupMutation,
  RemoveSourceFromSourceGroupMutationVariables,
} from '../gql/generated';

export type RemoveSourceFromSourceGroupService = Readonly<{
  removeSourceFromSourceGroup: (
    variables: RemoveSourceFromSourceGroupMutationVariables,
  ) => Promise<RemoveSourceFromSourceGroupMutation>;
}>;
