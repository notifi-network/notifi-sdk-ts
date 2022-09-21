import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
} from '../gql/generated';

export type CreateSourceService = Readonly<{
  createSource: (
    variables: CreateSourceMutationVariables,
  ) => Promise<CreateSourceMutation>;
}>;
