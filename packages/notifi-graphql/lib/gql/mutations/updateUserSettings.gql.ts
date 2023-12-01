import { gql } from 'graphql-request';

export const UpdateUserSettings = gql`
  mutation updateUserSettings($input: UserSettingsInput!) {
    updateUserSettings(userSettings: $input) {
      detailedAlertHistoryEnabled
      userHasChatEnabled
      ftuStage
    }
  }
`;
