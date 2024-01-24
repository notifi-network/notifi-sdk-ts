export enum NotificationTypeName {
  ACCOUNT_BALANCE_CHANGED = 'AccountBalanceChangedEventDetails',
  BROADCAST_MESSAGE = 'BroadcastMessageEventDetails',
  DIRECT_TENANT_MESSAGE = 'DirectTenantMessageEventDetails',
  NFT_COLLECTION_REPORT = 'NftCollectionsReportEventDetails',
  CHAT_MESSAGE_RECEIVED = 'ChatMessageReceivedEventDetails',
  DAO_PROPOSAL_CHANGED = 'DaoProposalChangedEventDetails',
  NFT_AUCTION_CHANGED = 'NftAuctionChangedEventDetails',
  WALLETS_ACTIVITY_CHANGED = 'WalletsActivityChangedEventDetails',
  HEALTH_VALUE_OVER_THRESHOLD = 'HealthValueOverThresholdEventDetails',
  GENERIC_EVENT = 'GenericEventDetails',
}

export const notificationHistoryEntryFragment = `
fragment NotificationHistoryEntry on NotificationHistoryEntry {
  id
  createdDate
  eventId
  read
  sourceAddress
  category
  transactionSignature
  targets {
    type
    name
  }
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
}`.trim();

export const notificationHistoryEntryFragmentDependencies = [];
