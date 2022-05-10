import {
  Alert,
  ClientConfiguration,
  Filter,
  Source,
  TargetGroup,
  User,
} from './models';

export type ClientData = Readonly<{
  alerts: ReadonlyArray<Alert>;
  filters: ReadonlyArray<Filter>;
  sources: ReadonlyArray<Source>;
  targetGroups: ReadonlyArray<TargetGroup>;
}>;

export type AlertFrequency =
  | 'ALWAYS'
  | 'SINGLE'
  | 'QUARTER_HOUR'
  | 'HOURLY'
  | 'DAILY';

export type FilterOptions = Partial<{
  alertFrequency: AlertFrequency;
  directMessageType: string;
  threshold: number;
  delayProcessingUntil: string;
}>;

/**
 * Input param for updating an Alert
 *
 * @remarks
 * This describes the Alert to be updated based on id, emailAddress, phoneNumber and/or telegramId
 *
 * @property alertId - The alert to modify
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientUpdateAlertInput = Readonly<{
  alertId: string;
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
}>;

/**
 * Input param for creating an Alert
 *
 * @remarks
 * This describes the Alert to be created based on name, emailAddress, phoneNumber and/or telegramId
 *
 * @property name - Friendly name (must be unique)
 * @property sourceGroupId - The SourceGroup to associate
 * @property filterId - The Filter to associate
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientCreateAlertInput = Readonly<{
  name: string;
  sourceId: string;
  filterId: string;
  filterOptions?: Readonly<FilterOptions>;
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  groupName?: string;
}>;

/**
 * Input param for creating a new Metaplex Auction Source
 *
 * @property auctionAddressBase58 - Metaplex auction address in base58
 * @property auctionWebUrl - Web URL where auction can be found
 *
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientCreateMetaplexAuctionSourceInput = Readonly<{
  auctionAddressBase58: string;
  auctionWebUrl: string;
}>;

/**
 * Input param for deleting an Alert
 *
 * @property alertId - The ID of the Alert to delete
 * @property keepTargetGroup - Whether to keep the target group on this Alert or to delete it
 * @property keepSourceGroup - Whether to keep the source group on this Alert or to delete it
 *
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientDeleteAlertInput = Readonly<{
  alertId: string;
  keepTargetGroup?: boolean;
  keepSourceGroup?: boolean;
}>;

export type MessageSigner = Readonly<{
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}>;

export type NotifiClient = Readonly<{
  fetchData: () => Promise<ClientData>;
  logIn: (signer: MessageSigner) => Promise<User>;
  createAlert: (input: ClientCreateAlertInput) => Promise<Alert>;
  createMetaplexAuctionSource: (
    input: ClientCreateMetaplexAuctionSourceInput,
  ) => Promise<Source>;
  deleteAlert: (input: ClientDeleteAlertInput) => Promise<string>;
  getConfiguration: () => Promise<ClientConfiguration>;
  updateAlert: (input: ClientUpdateAlertInput) => Promise<Alert>;
}>;
