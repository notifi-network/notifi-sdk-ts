import { gql } from 'graphql-request';

export const GetUserSettings = gql`
  query getUserSettings {
    userSettings {
      detailedAlertHistoryEnabled
      userHasChatEnabled
      ftuStage
    }
  }
`;
