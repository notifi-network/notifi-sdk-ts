// TODO: Import from library rather than copy / paste
import {
  AlertFrequency,
  CreateSourceInput,
  FilterOptions,
} from '@notifi-network/notifi-core';

export type ValueOrRef<ValueType> =
  | Readonly<{
      type: 'ref';
      ref: string | null;
    }>
  | Readonly<{
      type: 'value';
      value: ValueType;
    }>;

export type DirectPushEventTypeItem = Readonly<{
  type: 'directPush';
  name: string;
  directPushId: ValueOrRef<string>;
  tooltipContent?: string;
}>;

export type BroadcastEventTypeItem = Readonly<{
  type: 'broadcast';
  name: string;
  broadcastId: ValueOrRef<string>;
  tooltipContent?: string;
}>;

export type FusionTypeBase = {
  name: string;
  type: 'fusion';
  fusionEventId: ValueOrRef<string>;
  sourceAddress: ValueOrRef<string>;
  tooltipContent?: string;
  maintainSourceGroup?: boolean;
};

export type FusionToggleEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'TOGGLE';
  }>;

export type FusionHealthCheckEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'HEALTH_CHECK';
    healthCheckSubtitle: string;
    numberType: NumberTypeSelect;
    alertFrequency: AlertFrequency;
    checkRatios: CheckRatio[];
  }>;

export type FusionEventTypeItem =
  | FusionToggleEventTypeItem
  | FusionHealthCheckEventTypeItem;

export type HealthCheckEventTypeItem = Readonly<{
  type: 'healthCheck';
  name: string;
  checkRatios: ValueOrRef<CheckRatio[]>;
  alertFrequency: AlertFrequency;
  tooltipContent?: string;
}>;

type RatiosBelow = Readonly<{
  type: 'below';
  ratio: number;
}>;

type RatiosAbove = Readonly<{
  type: 'above';
  ratio: number;
}>;

export type CheckRatio = RatiosBelow | RatiosAbove;

export type LabelEventTypeItem = Readonly<{
  type: 'label';
  name: string;
  tooltipContent?: string;
}>;

export type TradingPairEventTypeItem = Readonly<{
  type: 'tradingPair';
  name: string;
  tooltipContent?: string;
  tradingPairs: ValueOrRef<ReadonlyArray<string>>;
}>;

export type WalletBalanceEventTypeItem = Readonly<{
  type: 'walletBalance';
  name: string;
  tooltipContent?: string;
}>;

export type PriceChangeDataSource = 'coingecko';

export type PriceChangeEventTypeItem = Readonly<{
  type: 'priceChange';
  name: string;
  tokenIds: ReadonlyArray<string>;
  dataSource: PriceChangeDataSource;
  tooltipContent: string;
}>;

export type USER_INTERFACE_TYPE = 'TOGGLE' | 'HEALTH_CHECK';

export type NumberTypeSelect = 'percentage' | 'integer';

export type CustomToggleTypeItem = Readonly<{
  filterOptions: FilterOptions;
  selectedUIType: 'TOGGLE';
}>;

export type CustomHealthCheckItem = Readonly<{
  selectedUIType: 'HEALTH_CHECK';
  healthCheckSubtitle: string;
  numberType: NumberTypeSelect;
  alertFrequency: AlertFrequency;
  checkRatios: CheckRatio[];
}>;

export type CustomTopicTypeItem = CustomTypeBase &
  (CustomToggleTypeItem | CustomHealthCheckItem);

export type UserInterfaceType = CustomTopicTypeItem['selectedUIType'];

export type CustomTypeBase = {
  type: 'custom';
  name: string;
  tooltipContent: string;
  sourceType: CreateSourceInput['type'];
  filterType: string;
  sourceAddress: ValueOrRef<string>;
};

export type XMTPTopicTypeItem = {
  type: 'XMTP';
  name: string;
  tooltipContent: string;
  sourceType?: CreateSourceInput['type'];
  filterType: string;
  XMTPTopics: ValueOrRef<ReadonlyArray<string>>;
};

export type EventTypeItem =
  | DirectPushEventTypeItem
  | BroadcastEventTypeItem
  | HealthCheckEventTypeItem
  | LabelEventTypeItem
  | TradingPairEventTypeItem
  | WalletBalanceEventTypeItem
  | PriceChangeEventTypeItem
  | CustomTopicTypeItem
  | XMTPTopicTypeItem;

export type EventTypeConfig = ReadonlyArray<EventTypeItem>;
export type InputType =
  | 'WebhookUrlInput'
  | 'WebhookHeadersInput'
  | 'DirectPushIdInput'
  | 'BroadcastIdInput';

export type InputItem = Readonly<{
  name: string;
  type: InputType;
}>;

export type InputsConfig = ReadonlyArray<InputItem>;

export type ContactInfo = Readonly<{
  active: boolean;
}>;
export type EmailContactInfo = ContactInfo;
export type DiscordContactInfo = ContactInfo;

export type CountryCode = string;

export type SmsContactInfo = ContactInfo &
  Readonly<{
    supportedCountryCodes: ReadonlyArray<CountryCode>;
  }>;

export type TelegramContactInfo = ContactInfo;

export type WebhookHeaders = Readonly<Record<string, string>>;

export type WebhookContactInfo = ContactInfo &
  Readonly<{
    url: ValueOrRef<string>;
    headers: ValueOrRef<WebhookHeaders>;
  }>;

export type ContactInfoConfig = Readonly<{
  email: EmailContactInfo;
  sms: SmsContactInfo;
  telegram: TelegramContactInfo;
  webhook: WebhookContactInfo;
  discord: DiscordContactInfo;
}>;

export type CardConfigItemV1 = Readonly<{
  version: 'v1';
  id: string | null;
  name: string;
  eventTypes: EventTypeConfig;
  inputs: InputsConfig;
  contactInfo: ContactInfoConfig;
  titles?: TitleSubtitleConfig;
}>;

export type TitleSubtitleConfigInactive = Readonly<{ active: false }>;

export type TitleSubtitleConfigActive = Readonly<{
  active: true;
  editView: string;
  previewView: string;
  historyView: string;
  signupView: string;
  expiredView: string;
  alertDetailsView: string;
  verifyWalletsView: string;
}>;

export type TitleSubtitleConfig =
  | TitleSubtitleConfigActive
  | TitleSubtitleConfigInactive;
