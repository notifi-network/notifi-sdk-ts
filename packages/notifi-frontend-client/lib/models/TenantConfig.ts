// TODO: Import from library rather than copy / paste
import { Types as Gql, Types } from '@notifi-network/notifi-graphql';

import { CardConfigType } from '../client';
import { AlertFrequency, FilterOptions } from './FilterOptions';

export type NumberTypeSelect = 'percentage' | 'integer' | 'price';

export type CountryCode = string;

export type SmsContactInfo = ContactInfo &
  Readonly<{
    supportedCountryCodes: ReadonlyArray<CountryCode>;
  }>;

/** Difference from Target in NotifiTargetContext is `sms` (phoneNumber in NotifiTargetContext) --> consolidate in the future */
export type TenantConfigTarget =
  | 'email'
  | 'sms'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'wallet'
  | 'browser';

export type ContactInfoConfig = Omit<
  Record<TenantConfigTarget, ContactInfo>,
  'sms'
> & {
  sms: SmsContactInfo;
};

export type TenantConfigV2 = Readonly<{
  cardConfig: CardConfigItemV2;
  fusionEventTopics: Array<TopicMetadata>;
}>;

export type TopicMetadata = {
  uiConfig: TopicUiConfig;
  fusionEventDescriptor: Types.FusionEventDescriptor;
};

export type CardConfigItemV2 = Readonly<{
  version: 'v2';
  name: string;
  id: string;
  contactInfo: ContactInfoConfig;
  isContactInfoRequired?: boolean;
  eventTypes: Array<TopicUiConfig | LabelUiConfig>;
}>;

export type TopicUiConfig = Readonly<{
  name: string;
  type: 'fusion';
  topicGroupName?: string;
  index?: number;
  fusionEventId: string;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type LabelUiConfig = Readonly<{
  type: 'label';
  name: string;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

export type ValueOrRef<ValueType> =
  | Readonly<{
      type: 'ref';
      ref: string | null;
    }>
  | Readonly<{
      type: 'value';
      value: ValueType;
    }>;

/** ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
 *  ⬇⬇⬇⬇ DEPRECATED ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
 *  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
 */

/**@deprecated */
export type LabelEventTypeItem = LabelUiConfig;

/**@deprecated */
export type FusionToggleEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'TOGGLE';
  }>;
/**@deprecated */
export type FusionHealthCheckEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'HEALTH_CHECK';
    healthCheckSubtitle: string;
    numberType: NumberTypeSelect;
    checkRatios: CheckRatio[];
    validInputRange?: ValidInputRange;
  }>;
/**@deprecated */
export type ValidInputRange = {
  max: number;
  min: number;
};
/**@deprecated */
export type FusionMultiThreshholdEventTypeItem = FusionTypeBase &
  Readonly<{
    selectedUIType: 'MULTI_THRESHOLD';
    numberType: NumberTypeSelect;
    subtitle?: string;
    addThreshholdTitle?: string;
  }>;
/**@deprecated */
export type FusionEventTypeItem =
  | FusionToggleEventTypeItem
  | FusionHealthCheckEventTypeItem
  | FusionMultiThreshholdEventTypeItem;
/**@deprecated */
export type BroadcastEventTypeItem = Readonly<{
  type: 'broadcast';
  name: string;
  broadcastId: ValueOrRef<string>;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
  displayNameOverride?: string;
}>;
/**@deprecated */
export type HealthCheckEventTypeItem = Readonly<{
  type: 'healthCheck';
  name: string;
  checkRatios: ValueOrRef<CheckRatio[]>;
  alertFrequency: AlertFrequency;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;

/**@deprecated */
export type DirectPushEventTypeItem = Readonly<{
  type: 'directPush';
  name: string;
  directPushId: ValueOrRef<string>;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;
/**@deprecated */
export type FusionTypeBase = {
  name: string;
  type: 'fusion' | 'fusionToggle'; // fusionToggle is deprecated (use fusion with selectedUIType: 'TOGGLE' instead)
  topicGroupName?: string;
  index?: number;
  fusionEventId: ValueOrRef<string>;
  sourceAddress: ValueOrRef<string>;
  tooltipContent?: string;
  maintainSourceGroup?: boolean;
  alertFrequency?: AlertFrequency;
  optOutAtSignup?: boolean;
  displayNameOverride?: string;
};
/**@deprecated */
export type TradingPairEventTypeItem = Readonly<{
  type: 'tradingPair';
  name: string;
  tooltipContent?: string;
  tradingPairs: ValueOrRef<ReadonlyArray<string>>;
  optOutAtSignup?: boolean;
}>;
/**@deprecated */
export type PriceChangeDataSource = 'coingecko';
/**@deprecated */
export type PriceChangeEventTypeItem = Readonly<{
  type: 'priceChange';
  name: string;
  tokenIds: ReadonlyArray<string>;
  dataSource: PriceChangeDataSource;
  tooltipContent: string;
  optOutAtSignup?: boolean;
}>;
/**@deprecated */
export type WalletBalanceEventTypeItem = Readonly<{
  type: 'walletBalance';
  name: string;
  tooltipContent?: string;
  optOutAtSignup?: boolean;
}>;
/**@deprecated */
export type CustomTypeBase = {
  type: 'custom';
  name: string;
  tooltipContent: string;
  sourceType: Gql.SourceType;
  filterType: string;
  sourceAddress: ValueOrRef<string>;
  optOutAtSignup?: boolean;
};
/**@deprecated */
export type CustomToggleTypeItem = Readonly<{
  filterOptions: FilterOptions;
  selectedUIType: 'TOGGLE';
  optOutAtSignup?: boolean;
}>;

/**@deprecated */
export type CustomHealthCheckItem = Readonly<{
  selectedUIType: 'HEALTH_CHECK';
  healthCheckSubtitle: string;
  numberType: NumberTypeSelect;
  alertFrequency: AlertFrequency;
  checkRatios: CheckRatio[];
  optOutAtSignup?: boolean;
}>;

// TODO: Relates to Source, remove source
/**@deprecated */
type RatiosBelow = Readonly<{
  type: 'below';
  ratio: number;
}>;
/**@deprecated */
type RatiosAbove = Readonly<{
  type: 'above';
  ratio: number;
}>;
/**@deprecated */
export type CheckRatio = RatiosBelow | RatiosAbove;
/**@deprecated */
export type CustomTopicTypeItem = CustomTypeBase &
  (CustomToggleTypeItem | CustomHealthCheckItem);
/**@deprecated */
export type XMTPTopicTypeItem = {
  type: 'XMTP';
  name: string;
  tooltipContent: string;
  sourceType?: Gql.SourceType;
  filterType: string;
  XMTPTopics: ValueOrRef<ReadonlyArray<string>>;
  optOutAtSignup?: boolean;
};
/**@deprecated */
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
  | XMTPTopicTypeItem;
/**@deprecated */
export type EventTypeConfig = ReadonlyArray<EventTypeItem>;
/**@deprecated */
export type InputType =
  | 'WebhookUrlInput'
  | 'WebhookHeadersInput'
  | 'DirectPushIdInput'
  | 'BroadcastIdInput';
/**@deprecated */
export type InputItem = Readonly<{
  name: string;
  type: InputType;
}>;
/**@deprecated */
export type InputsConfig = ReadonlyArray<InputItem>;

export type ContactInfo = Readonly<{
  active: boolean;
}>;
/**@deprecated */
export type WebhookHeaders = Readonly<Record<string, string>>;
/**@deprecated */
export type WebhookContactInfo = ContactInfo &
  Readonly<{
    url: ValueOrRef<string>;
    headers: ValueOrRef<WebhookHeaders>;
  }>;
/**@deprecated */
export type CardConfigItemV1 = Readonly<{
  version: 'v1';
  id: string | null;
  name: string;
  eventTypes: EventTypeConfig;
  inputs: InputsConfig;
  contactInfo: ContactInfoConfig;
  isContactInfoRequired?: boolean;
  titles?: TitleSubtitleConfig;
}>;
/**@deprecated */
export type TitleSubtitleConfigInactive = Readonly<{ active: false }>;
/**@deprecated */
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
/**@deprecated */
export type TitleSubtitleConfig =
  | TitleSubtitleConfigActive
  | TitleSubtitleConfigInactive;
/**@deprecated */
export type FusionEventTopic = {
  // The following from original fusionEventTypeItem (Legacy)
  uiConfig: FusionEventTypeItem;
  // The following is the respective fusionEventDescriptor
  fusionEventDescriptor: Types.FusionEventDescriptor;
};
/**@deprecated */
export type TenantConfig = {
  cardConfig: CardConfigType; // Legacy
  fusionEventTopics: ReadonlyArray<FusionEventTopic>;
};
