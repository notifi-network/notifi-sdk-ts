import { gql } from 'graphql-request';

export const ActiveAlertFragment = gql`
  fragment ActiveAlertFragment on ActiveAlert {
    __typename
    id
    filterOptionsJson
    fusionEventId
    subscriptionValue
    user {
      __typename
      id
      connectedWallets {
        address
        walletBlockchain
      }
    }
  }
`;
