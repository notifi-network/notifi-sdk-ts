import { gql } from 'graphql-request';

export const FusionNotificationHistoryEntryFragment = gql`
  fragment FusionNotificationHistoryEntryFragment on FusionNotificationHistoryEntry {
    __typename
    id
    createdDate
    read
    fusionEventVariables
    detail {
      __typename
      ... on AccountBalanceChangedEventDetails {
        walletBlockchain
        direction
        newValue
        previousValue
        tokenSymbol
        isWhaleWatch
      }
      ... on BroadcastMessageEventDetails {
        messageType: type
        subject
        message
        messageHtml
      }
      ... on DirectTenantMessageEventDetails {
        tenantName
        targetTemplatesJson
        templateVariablesJson
      }
      ... on NftCollectionsReportEventDetails {
        type
        providerName
        sourceLink
        collections {
          collectionId
          name
          imgUrl
          volume1Day
          volume1DayChange
        }
      }
      ... on ChatMessageReceivedEventDetails {
        senderName
        conversationId
        messageId
        senderId
        senderBlockchain
        senderName
        messageBody
      }
      ... on DAOProposalChangedEventDetails {
        tenantName
        proposalTitle: title
        description
        state
        daoUrl
        proposalUrl
      }
      ... on NftAuctionChangedEventDetails {
        auctionTitle: title
        auctionUrl
        walletBlockchain
        highBidAmount
        highBidSymbol
        imageUrl
      }
      ... on WalletsActivityReportEventDetails {
        providerName
        sourceLink
        walletActivityType: type
        wallets {
          address
          volume1Day
          maxPurchase1Day
          maxPurchaseName
          maxPurchaseImgUrl
          maxPurchaseTokenAddress
        }
      }
      ... on HealthValueOverThresholdEventDetails {
        name
        value
        threshold
        url
      }
      ... on GenericEventDetails {
        sourceName
        notificationTypeName
        genericMessage: message
        genericMessageHtml: messageHtml
        eventDetailsJson
        action {
          name
          url
        }
        icon
      }
    }
  }
`;
