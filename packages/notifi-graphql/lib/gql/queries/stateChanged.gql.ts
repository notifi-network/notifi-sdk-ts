import { gql } from 'graphql-request';

export const stateChanged = gql`
subscription stateChanged {
  stateChanged {
    fusionEventTypeId,
    actualNotificationDateTime,
    eventPublishDateTime
  }
}
`;