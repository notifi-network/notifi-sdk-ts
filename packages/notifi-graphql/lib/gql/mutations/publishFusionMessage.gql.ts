import { gql } from 'graphql-request';

export const PublishFusionMessage = gql`
  mutation publishFusionMessage(
    $eventTypeId: String!
    $variablesJson: String!
    $specificWallets: [KeyValuePairOfStringAndWalletBlockchainInput!]
  ) {
    publishFusionMessage(
      publishFusionMessageInput: {
        eventTypeId: $eventTypeId
        variablesJson: $variablesJson
        specificWallets: $specificWallets
      }
    ) {
      eventUuid
    }
  }
`;
