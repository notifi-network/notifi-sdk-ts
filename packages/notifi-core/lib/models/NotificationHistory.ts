/**
 * Object describing Notification History
 *
 * @remarks
 * Object describing Notification History
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string} filterType - Type of the filter
 *
 */

export type NotificationHistory = Readonly<{
  nodes?: Array<NotificationHistoryEntry> | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;

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

export type Target = {
  type: TargetType;
  name?: string;
};

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

export type AccountBalanceChangedEventDetails = {
  __typename: 'AccountBalanceChangedEventDetails';
  walletBlockchain: WalletBlockchain;
  direction: AccountBalanceChangeDirection;
  newValue: number;
  previousValue: number;
  tokenSymbol: string;
  isWhaleWatch: boolean;
};

export type BroadcastMessageEventDetails = {
  __typename: 'BroadcastMessageEventDetails';
  subject?: string;
  message?: string;
  messageType: string;
};

export type ChatMessageReceivedEventDetails = {
  __typename: 'ChatMessageReceivedEventDetails';
  messageBody: string;
  senderName: string;
  conversationId: string;
  messageId: string;
  senderId: string;
  senderBlockchain: WalletBlockchain;
};

export type DAOProposalChangedEventDetails = {
  __typename: 'DAOProposalChangedEventDetails';
  tenantName: string;
  description: string;
  state?: string;
  daoUrl?: string;
  proposalUrl?: string;
  proposalTitle?: string;
};

export type DirectTenantMessageEventDetails = {
  __typename: 'DirectTenantMessageEventDetails';
  tenantName: string;
};

export type GenericEventDetails = {
  __typename: 'GenericEventDetails';
  sourceName: string;
  notificationTypeName: string;
  genericMessage: string;
  action?: GenericEventAction;
};

export type GenericEventAction = {
  __typename?: 'GenericEventAction';
  name: string;
  url: string;
};

export type HealthValueOverThresholdEventDetails = {
  __typename: 'HealthValueOverThresholdEventDetails';
  name: string;
  value: string;
  threshold: string;
  url: string;
};

export type NftAuctionChangedEventDetails = {
  __typename: 'NftAuctionChangedEventDetails';
  auctionUrl?: string;
  walletBlockchain: WalletBlockchain;
  highBidAmount: number;
  highBidSymbol?: string;
  imageUrl?: string;
  auctionTitle: string;
};

export type NftCollectionsReportEventDetails = {
  __typename: 'NftCollectionsReportEventDetails';
  type: NftCollectionsReportType;
  providerName: string;
  sourceLink: string;
  collections: NftCollectionStats[];
};

export type NftCollectionStats = {
  __typename?: 'NftCollectionStats';
  collectionId: string;
  name: string;
  imgUrl?: string;
  volume1Day?: string;
  volume1DayChange?: string;
};

export type WalletsActivityReportEventDetails = {
  __typename: 'WalletsActivityReportEventDetails';
  providerName: string;
  sourceLink: string;
  walletActivityType: WalletsActivityReportType;
  wallets: WalletsActivityReportWallet[];
};

export type WalletsActivityReportWallet = {
  __typename?: 'WalletsActivityReportWallet';
  address: string;
  volume1Day: string;
  maxPurchase1Day?: string;
  maxPurchaseName?: string;
  maxPurchaseImgUrl?: string | undefined;
  maxPurchaseTokenAddress?: string | undefined;
};

export type EntryDetailType =
  | AccountBalanceChangedEventDetails
  | BroadcastMessageEventDetails
  | ChatMessageReceivedEventDetails
  | DAOProposalChangedEventDetails
  | DirectTenantMessageEventDetails
  | GenericEventDetails
  | HealthValueOverThresholdEventDetails
  | NftAuctionChangedEventDetails
  | NftCollectionsReportEventDetails
  | WalletsActivityReportEventDetails;

export type NotificationHistoryEntry = Readonly<{
  __typename?: 'NotificationHistoryEntry';
  id: string;
  createdDate: string;
  eventId: string;
  read: boolean;
  sourceAddress?: string;
  transactionSignature?: string;
  targets: Target[];
  detail?: EntryDetailType;
}>;
