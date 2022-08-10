import {
  CreateEmailTargetMutation,
  CreateEmailTargetMutationVariables,
} from '../gql/generated';

export type CreateEmailTargetService = Readonly<{
  createEmailTarget: (
    variables: CreateEmailTargetMutationVariables,
  ) => Promise<CreateEmailTargetMutation>;
}>;
