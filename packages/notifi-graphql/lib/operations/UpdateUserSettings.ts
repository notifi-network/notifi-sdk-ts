import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from '../gql/generated';

export type UpdateUserSettingsService = Readonly<{
  updateUserSettings: (
    variables: UpdateUserSettingsMutationVariables,
  ) => Promise<UpdateUserSettingsMutation>;
}>;
