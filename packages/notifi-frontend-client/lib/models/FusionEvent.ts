import { Types } from '@notifi-network/notifi-graphql';

export type FusionEventMetadata = {
  uiConfigOverride?: {
    topicDisplayName?: string;
    historyDisplayName?: string;
    icon?: Types.GenericEventIconHint;
    customIconUrl?: string;
  };
  filters: Array<AlertFilter>;
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
  minimumDurationBetweenTriggersInMinutes: number;
};

export type AlertFilter = FilterBase & {
  userInputParams: UserInputParam<UiType>[];
  type: FilterType;
  staticFilterParams?: Record<string, object | string | number>;
  requiredParserVariables: Array<RequiredParserVariable>;
  description: string;
};

export type RequiredParserVariable = {
  variableName: string;
  variableType: ValueType;
  variableDescription: string;
};

export type ValueType = 'integer' | 'price' | 'percentage' | 'string';

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
};

export type UiType = 'radio' | 'button';
export type FilterType = 'AlertFilter';

export type FusionFilterOptions = {
  input: Record<Filter['name'], UserInputOptions>;
};

export type UserInputOptions = Record<
  UserInputParam<UiType>['name'],
  UserInputParam<UiType>['options'][number]
>;
