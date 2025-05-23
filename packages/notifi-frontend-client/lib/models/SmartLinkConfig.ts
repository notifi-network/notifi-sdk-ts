import type { Types } from '@notifi-network/notifi-graphql';

export type SmartLinkConfig = {
  id: string;
  icon: string;
  tenantName: string;
  bannerImgUrl: string;
  blockchainType: Types.BlockchainType;
  name: string;
  description: string;
  title: string;
  subtitle: string;
  components: (SmartLinkAction | SmartLinkTxt | SmartLinkImg)[];
};

export type SmartLinkTxt = {
  type: 'TEXT';
  text: string;
};

export type SmartLinkImg = {
  type: 'IMAGE';
  src: string;
  alt: string;
};

export type SmartLinkAction = {
  type: 'ACTION';
  id: string;
  inputs: ActionInputParams[];
  label: string /** This is the label that will be displayed on Action button */;
};

export type ActionInputParams =
  | ActionInputParamsTextBox<'NUMBER'>
  | ActionInputParamsTextBox<'TEXT'>
  | ActionInputParamsCheckBox;

type ActionInputBaseParams = {
  isRequired: boolean;
  id: string;
};

export type ActionInputParamsTextBox<T extends 'TEXT' | 'NUMBER'> =
  ActionInputBaseParams & {
    type: 'TEXTBOX';
    inputType: T;
    placeholder: T extends 'NUMBER' ? number : string;
    default: T extends 'NUMBER' ? number : string;
    constraintType?: T extends 'NUMBER' ? NumberConstraint : StringConstraint;
    prefix?: string;
    suffix?: string;
  };

export type ActionInputParamsCheckBox = ActionInputBaseParams & {
  type: 'CHECKBOX';
  title: string;
};

type NumberConstraint = {
  min?: number;
  max?: number;
};

type StringConstraint = {
  minLength?: number;
  maxLength?: number;
  pattern?: string /** Regex pattern */;
};

/* ⬇ Validators */

export const isSmartLinkConfig = (obj: unknown): obj is SmartLinkConfig => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const config = obj as SmartLinkConfig;
  return (
    typeof config.id === 'string' &&
    typeof config.icon === 'string' &&
    typeof config.blockchainType === 'string' &&
    typeof config.title === 'string' &&
    typeof config.subtitle === 'string' &&
    Array.isArray(config.components)
  );
};
