import { ContactInfoConfig } from './SubscriptionCardConfig';

type LabelItemConfigs<Config> = Readonly<{
  [K in LabelType]: Config;
}>;

export const LABEL_TYPE_MENU_LABELS: LabelItemConfigs<string> = {
  ChatCompanyName: 'Chat Company Name',
  ChatFTUTitle: 'Chat FTU Title',
  ChatFTUDescription: 'Chat FTU Description',
  ChatFTUSubTitle: 'Chat FTU Sub Title',
  ChatBannerTitle: 'Chat Banner Title',
  ChatIntroQuestion: 'Chat Intro Question',
};

export type LabelType =
  | 'ChatCompanyName'
  | 'ChatFTUTitle'
  | 'ChatFTUDescription'
  | 'ChatFTUSubTitle'
  | 'ChatBannerTitle'
  | 'ChatIntroQuestion';

export type LabelItem = {
  name: string | null;
  type: LabelType;
  label: keyof typeof LABEL_TYPE_MENU_LABELS;
};

export type LabelsConfig = Array<LabelItem>;

export type IntercomCardConfigItemV1 = Readonly<{
  version: 'IntercomV1';
  id: string | null;
  name: string;
  labels: LabelsConfig;
  contactInfo: ContactInfoConfig;
}>;
