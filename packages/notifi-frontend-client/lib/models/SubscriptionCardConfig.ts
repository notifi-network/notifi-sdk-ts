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
  optOutAtSignup?: boolean;
}>;

export type FusionTypeBase = {
  name: string;
  type: 'fusion' | 'fusionToggle'; // fusionToggle is deprecated (use fusion with selectedUIType: 'TOGGLE' instead)
  fusionEventId: ValueOrRef<string>;
  sourceAddress: ValueOrRef<string>;
  tooltipContent?: string;
  maintainSourceGroup?: boolean;
  alertFrequency?: AlertFrequency;
  optOutAtSignup?: boolean;
  displayNameOverride?: string;
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
    checkRatios: CheckRatio[];
  }>;

export type FusionMultiThreshholdEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'MULTI_THRESHOLD';
    numberType: NumberTypeSelect;
    subtitle?: string;
    addThreshholdTitle?: string;
  }>;

export type FusionEventTypeItem =
  | FusionToggleEventTypeItem
  | FusionHealthCheckEventTypeItem
  | FusionMultiThreshholdEventTypeItem;

export type BroadcastEventTypeItem = Readonly<{
  type: 'broadcast';
  name: string;
  broadcastId: ValueOrRef<string>;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type HealthCheckEventTypeItem = Readonly<{
  type: 'healthCheck';
  name: string;
  checkRatios: ValueOrRef<CheckRatio[]>;
  alertFrequency: AlertFrequency;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type LabelEventTypeItem = Readonly<{
  type: 'label';
  name: string;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type TradingPairEventTypeItem = Readonly<{
  type: 'tradingPair';
  name: string;
  tooltipContent?: string;
  tradingPairs: ValueOrRef<ReadonlyArray<string>>;
  optOutAtSignup?: boolean;
}>;

export type PriceChangeDataSource = 'coingecko';

export type PriceChangeEventTypeItem = Readonly<{
  type: 'priceChange';
  name: string;
  tokenIds: ReadonlyArray<string>;
  dataSource: PriceChangeDataSource;
  tooltipContent: string;
  optOutAtSignup?: boolean;
}>;

export type WalletBalanceEventTypeItem = Readonly<{
  type: 'walletBalance';
  name: string;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type CustomTypeBase = {
  type: 'custom';
  name: string;
  tooltipContent: string;
  sourceType: Gql.SourceType;
  filterType: string;
  sourceAddress: ValueOrRef<string>;
  optOutAtSignup?: boolean;
};

export type CustomToggleTypeItem = Readonly<{
  filterOptions: FilterOptions;
  selectedUIType: 'TOGGLE';
  optOutAtSignup?: boolean;
}>;

export type NumberTypeSelect = 'percentage' | 'integer' | 'price';

export type CustomHealthCheckItem = Readonly<{
  selectedUIType: 'HEALTH_CHECK';
  healthCheckSubtitle: string;
  numberType: NumberTypeSelect;
  alertFrequency: AlertFrequency;
  checkRatios: CheckRatio[];
  optOutAtSignup?: boolean;
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

export type XMTPTopicTypeItem = {
  type: 'XMTP';
  name: string;
  tooltipContent: string;
  sourceType?: Gql.SourceType;
  filterType: string;
  XMTPTopics: ValueOrRef<ReadonlyArray<string>>;
  optOutAtSignup?: boolean;
};

export type CreateSupportConversationEventTypeItem = {
  type: 'createSupportConversation';
  name: string;
  sourceType: Gql.SourceType;
  filterType: string;
  alertFrequency: AlertFrequency;
  optOutAtSignup?: boolean;
};

export type EventTypeItem =
  | DirectPushEventTypeItem
  | BroadcastEventTypeItem
  | HealthCheckEventTypeItem
  | TradingPairEventTypeItem
  | LabelEventTypeItem
  | PriceChangeEventTypeItem
  | CustomTopicTypeItem
  | FusionEventTypeItem
  | WalletBalanceEventTypeItem
  | XMTPTopicTypeItem
  | CreateSupportConversationEventTypeItem;

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

export type CardConfigItem = CardConfigItemV1 | CardConfigItemV2;

export type CardConfigItemV2 = Readonly<
  { version: 'v2'; topicTypes: TopicTypeItem[] } & CardConfigBase
>;

export type CardConfigItemV1 = Readonly<
  { version: 'v1'; eventTypes: EventTypeConfig } & CardConfigBase
>;

export type CardConfigBase = Readonly<{
  id: string | null;
  name: string;
  inputs: InputsConfig;
  contactInfo: ContactInfoConfig;
  isContactInfoRequired?: boolean;
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

// SDK3.0 (SubscriptionCardV2)
// Rename EventTypeItem to TopicTypeItem for the naming convention (AP V2)
export type TopicTypeItem = TopicTypeItemBase & FrontendUIType;

type TopicTypeItemBase = {
  name: string;
  type: 'fusion'; // This is for backward compatibility to differentiate from legacy type.
  fusionEventId: ValueOrRef<string>;
  sourceAddress: ValueOrRef<string>;
  tooltipContent?: string;
  maintainSourceGroup?: boolean;
  alertFrequency?: AlertFrequency;
  optOutAtSignup?: boolean;
  displayNameOverride?: string;
};

// To differentiate fusion UI type, use `selectedUIType`.
type FrontendUIType = Toggle | HealthCheck | MultiThreshold;

type Toggle = Readonly<{
  selectedUIType: 'TOGGLE';
}>;

type HealthCheck = Readonly<{
  selectedUIType: 'HEALTH_CHECK';
  healthCheckSubtitle: string;
  numberType: NumberTypeSelect;
  checkRatios: CheckRatio[];
}>;

type MultiThreshold = Readonly<{
  selectedUIType: 'MULTI_THRESHOLD';
  numberType: NumberTypeSelect;
  subtitle?: string;
  addThreshholdTitle?: string;
}>;
