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

export type LabelEventTypeItem = Readonly<{
  type: 'label';
  name: string;
  tooltipContent?: string;
}>;

export type EventTypeItem =
  | DirectPushEventTypeItem
  | BroadcastEventTypeItem
  | LabelEventTypeItem;

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
