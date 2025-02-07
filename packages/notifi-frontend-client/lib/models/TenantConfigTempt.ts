import { Types } from '@notifi-network/notifi-graphql';

import { CardConfigItemV1 } from './TenantConfig';

export type TenantInfo = {
  cardConfig: TenantConfigMetadata;
  fusionEventTopics: Array<TopicMetadata>;
};

export type TopicMetadata = {
  uiConfig: TopicUiConfig;
  fusionEventDescriptor: Types.FusionEventDescriptor;
};

/** v2 of CardConfigItemV1 (rename) */
export type TenantConfigMetadata =
  | {
      version: 'v2'; // TODO: TBD
      id: string;
      contactInfo: ContactInfoConfig;
      isContactInfoRequired?: boolean;
      eventTypes: Array<TopicUiConfig>;
    }
  | CardConfigItemV1; // Legacy infra

export type ContactInfoConfig = Record<Target, ContactInfo>;

export type Target = // TODO: Remove type form notifi-react context. Use this instead
  'email' | 'sms' | 'telegram' | 'discord' | 'slack' | 'wallet';

export type ContactInfo = Readonly<{
  active: boolean;
}>;

export type TopicUiConfig = {
  name: string;
  type: 'fusion';
  topicGroupName?: string;
  index?: number;
  fusionEventId: string; // TODO: need further refactor (changed from ValueOrRef<string> to string)
  tooltipContent?: string;
  optOutAtSignup?: boolean;
  displayNameOverride?: string;
};
