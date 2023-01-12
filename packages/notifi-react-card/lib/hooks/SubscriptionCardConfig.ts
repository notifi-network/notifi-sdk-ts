// TODO: Import from library rather than copy / paste

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

export type HealthCheckEventTypeItem = Readonly<{
  type: 'healthCheck';
  name: string;
  checkRatios: ValueOrRef<CheckRatio[]>;
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

export type EventTypeItem =
  | DirectPushEventTypeItem
  | BroadcastEventTypeItem
  | HealthCheckEventTypeItem
  | LabelEventTypeItem
  | TradingPairEventTypeItem;

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
