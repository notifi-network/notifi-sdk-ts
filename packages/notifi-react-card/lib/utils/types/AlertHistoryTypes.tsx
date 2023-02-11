enum TargetType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  WEBHOOK = 'WEBHOOK',
}

enum WalletBlockchain {
  ACALA = 'ACALA',
  APTOS = 'APTOS',
  ARBITRUM = 'ARBITRUM',
  AVALANCHE = 'AVALANCHE',
  BINANCE = 'BINANCE',
  ETHEREUM = 'ETHEREUM',
  NEAR = 'NEAR',
  OFF_CHAIN = 'OFF_CHAIN',
  POLYGON = 'POLYGON',
  SOLANA = 'SOLANA',
}

enum AccountBalanceChangeDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

enum NftCollectionsReportType {
  HOT = 'HOT',
  MOST_TRADED = 'MOST_TRADED',
}

enum WalletsActivityReportType {
  MOST_ACTIVE = 'MOST_ACTIVE',
}

export type NotificationHistoryEntryFragment = {
  __typename?: 'NotificationHistoryEntry';
  id: string;
  createdDate: string;
  eventId: string;
  read: boolean;
  sourceAddress?: string | undefined;
  transactionSignature?: string | undefined;
  targets: Array<{
    type: TargetType;
    name?: string | undefined;
  }>;
  detail?:
    | {
        __typename: 'AccountBalanceChangedEventDetails';
        walletBlockchain: WalletBlockchain;
        direction: AccountBalanceChangeDirection;
        newValue: number;
        previousValue: number;
        tokenSymbol: string;
        isWhaleWatch: boolean;
      }
    | {
        __typename: 'BroadcastMessageEventDetails';
        subject?: string | undefined;
        message?: string | undefined;
        messageType: string;
      }
    | {
        __typename: 'ChatMessageReceivedEventDetails';
        messageBody: string;
        senderName: string;
        conversationId: string;
        messageId: string;
        senderId: string;
        senderBlockchain: WalletBlockchain;
      }
    | {
        __typename: 'DAOProposalChangedEventDetails';
        tenantName: string;
        description: string;
        state?: string | undefined;
        daoUrl?: string | undefined;
        proposalUrl?: string | undefined;
        proposalTitle?: string | undefined;
      }
    | { __typename: 'DirectTenantMessageEventDetails'; tenantName: string }
    | {
        __typename: 'GenericEventDetails';
        sourceName: string;
        notificationTypeName: string;
        genericMessage: string;
        action?:
          | { __typename?: 'GenericEventAction'; name: string; url: string }
          | undefined;
      }
    | {
        __typename: 'HealthValueOverThresholdEventDetails';
        name: string;
        value: string;
        threshold: string;
        url: string;
      }
    | {
        __typename: 'NftAuctionChangedEventDetails';
        auctionUrl?: string | undefined;
        walletBlockchain: WalletBlockchain;
        highBidAmount: number;
        highBidSymbol?: string | undefined;
        imageUrl?: string | undefined;
        auctionTitle: string;
      }
    | {
        __typename: 'NftCollectionsReportEventDetails';
        type: NftCollectionsReportType;
        providerName: string;
        sourceLink: string;
        collections: Array<{
          __typename?: 'NftCollectionStats';
          collectionId: string;
          name: string;
          imgUrl?: string | undefined;
          volume1Day?: string | undefined;
          volume1DayChange?: string | undefined;
        }>;
      }
    | {
        __typename: 'WalletsActivityReportEventDetails';
        providerName: string;
        sourceLink: string;
        walletActivityType: WalletsActivityReportType;
        wallets: Array<{
          __typename?: 'WalletsActivityReportWallet';
          address: string;
          volume1Day: string;
          maxPurchase1Day?: string | undefined;
          maxPurchaseName?: string | undefined;
          maxPurchaseImgUrl?: string | undefined;
          maxPurchaseTokenAddress?: string | undefined;
        }>;
      }
    | undefined;
};
