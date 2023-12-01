import type {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from '../gql/generated';

export type GetUserSettingsService = Readonly<{
  getUserSettings: (
    variables: GetUserSettingsQueryVariables,
  ) => Promise<GetUserSettingsQuery>;
}>;
