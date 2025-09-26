import { Types } from '@notifi-network/notifi-graphql';

import { ValueOrRef } from './TenantConfig';

export type FusionEventMetadata = {
  uiConfigOverride?: {
    topicDisplayName?: string;
    historyDisplayName?: string;
    icon?: Types.GenericEventIconHint;
    customIconUrl?: string;
    isSubscriptionValueInputable?: boolean;
    subscriptionValueOrRef?: ValueOrRef<InputObject[]>;
    /* NOTE: the generic type
     * 1. if the type field is 'value', the value field will be an array with only one element where the value must be '*'. This case, isSubscriptionValueInputable must be false or undefined.
       - {type: 'value', value: [{label: '', value: '*'}]}: In this case, we do not care the label because we will not render any options. we only subscribe the value '*'
     * 2. if it is a ref type, it will be an array of InputObject . see example below. This case, isSubscriptionValueInputable could be true or false.
         - Example#1: isSubscriptionValueInputable is (false or undefined) & subscriptionValueOrRef is {type: 'ref', ref: 'walletAddress'}.  This case, we use the resolveObjectArrayRef to get the subscriptionValue from inputs and use its value of first InputObject element. So the inputs will be {walletAddress: [{label: 'ETH', value: '<user-wallet-address>'}]}
         - Example#2: isSubscriptionValueInputable is (true) & subscriptionValueOrRef is {type: 'ref', ref: 'pricePairs'}: In this case, we will render the options from the ref 'pricePairs' using the resolveObjectArrayRef function
     */
  };
  filters: Array<Filter>;
};

export type InputObject = {
  label: string;
  value: string;
};

/**
 * @param name - `string` unique name
 */
export type Filter = AlertFilter | FrequencyFilter;
export type FilterBase = {
  name: string;
  executionPriority: number;
};

export type FrequencyFilter = FilterBase & {
  type: 'FrequencyAlertFilter';
  minimumDurationBetweenTriggersInMinutes: number;
};

export type AlertFilter = FilterBase & {
  type: 'AlertFilter';
  userInputParams: UserInputParam<UiType>[];
  staticFilterParams?: Record<string, object | string | number>;
  requiredParserVariables: Array<RequiredParserVariable>;
  description: string;
};

export type RequiredParserVariable = {
  variableName: string;
  variableType: ValueType;
  variableDescription: string;
};

// price is deprecated: use float or integer with {prefix: '$', suffix: ''} as userInputParam.prefixAndSuffix
export type ValueType = 'integer' | 'price' | 'percentage' | 'string' | 'float';
export type PrefixAndSuffix = {
  prefix: string;
  suffix: string;
};
/**
 * @param UiType - `radio` or `button` (scalable). Define what component should be rendered in Card topic subscription view.
 * @param defaultValue - The value for default alert subscription
 */
export type UserInputParam<T extends UiType> = {
  name: string;
  kind: ValueType;
  uiType: T;
  description: string;
  options: (string | number)[];
  defaultValue: string | number;
  allowCustomInput?: boolean;
  customInputPlaceholder?: string;
  prefixAndSuffix?: PrefixAndSuffix;
  customInputConstraints?: CustomInputConstraints;
};

export type CustomInputConstraints = {
  maxDecimalPlaces?: number;
  upperBound?: number;
  lowerBound?: number;
};
export type UiType = 'radio' | 'button';

export type FusionFilterOptions = {
  version: 1;
  input: Record<Filter['name'], UserInputOptions>;
};

export type UserInputOptions = Record<
  UserInputParam<UiType>['name'],
  UserInputParam<UiType>['options'][number]
>;

/**
 * FusionNotificationHistoryEntry.fusionEventVariables
 */
export type HistoryFusionEventVariables = {
  EventData: unknown;
  AlertData: unknown;
  NotifiData: {
    TenantId: string;
    TenantName: string;
    ChangeSignature: string;
    SourceTypeId: string;
    AlertId: string;
    ComparisonValue: string;
    EventTypeId: string;
    TopicHistoryDisplayName: string;
    Blockchain: string;
    PixelUrl: string;
  };
  unsubscribe_url: string;
};
