// TODO: Import from library rather than copy / paste
import { Types as Gql } from '@notifi-network/notifi-graphql';

import { AlertFrequency, FilterOptions } from './FilterOptions';

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

export type PriceChangeDataSource = 'coingecko';

export type PriceChangeEventTypeItem = Readonly<{
  type: 'priceChange';
  name: string;
  tokenIds: ReadonlyArray<string>;
  dataSource: PriceChangeDataSource;
  tooltipContent: string;
}>;

export type CustomTypeBase = {
  type: 'custom';
  name: string;
  tooltipContent: string;
  sourceType: Gql.SourceType;
  filterType: string;
  sourceAddress: ValueOrRef<string>;
};

export type CustomToggleTypeItem = Readonly<{
  filterOptions: FilterOptions;
  selectedUIType: 'TOGGLE';
}>;

export type NumberTypeSelect = 'percentage' | 'integer';

export type CustomHealthCheckItem = Readonly<{
  selectedUIType: 'HEALTH_CHECK';
  healthCheckSubtitle: string;
  numberType: NumberTypeSelect;
  alertFrequency: AlertFrequency;
  checkRatios: CheckRatio[];
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

export type CustomTopicTypeItem = CustomTypeBase &
  (CustomToggleTypeItem | CustomHealthCheckItem);

export type EventTypeItem =
  | DirectPushEventTypeItem
  | BroadcastEventTypeItem
  | TradingPairEventTypeItem
  | LabelEventTypeItem
  | PriceChangeEventTypeItem
  | CustomTopicTypeItem;

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
}>;

export type CardConfigItemV1 = Readonly<{
  version: 'v1';
  id: string | null;
  name: string;
  eventTypes: EventTypeConfig;
  inputs: InputsConfig;
  contactInfo: ContactInfoConfig;
}>;
