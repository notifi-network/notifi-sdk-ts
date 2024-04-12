export type FusionEventMetadata = {
  uiConfigOverride?: {
    topicDisplayName?: string;
    historyDisplayName?: string;
  };
  filters: Array<AlertFilter>;
  requiredParserVariables: Array<RequiredParserVariable>;
};

/**
 * @param name - `string` unique name
 */
export type AlertFilter = AlertFilterBase | AlertFrequencyFilter;
export type AlertFilterBase = {
  name: string;
  type: AlertFilterType;
  executionPriority: number;
  userInputParams: UserInputParam<UiType>[];
  staticFilterParams?: Record<string, object | string | number>;
};

export type AlertFrequencyFilter = AlertFilterBase & {
  minimumDurationBetweenTriggersInMinutes: number;
};

export type RequiredParserVariable = {
  variableName: string;
  variableType: ValueType;
  variableDescription: string;
};

export type ValueType = 'integer' | 'price' | 'percentage';

/**
 * @param UiType - `radio` or `button` (scalable). Define what component should be rendered in Card topic subscription view.
 * @param defaultValue - The value for default alert subscription
 */
export type UserInputParam<T extends UiType> = {
  name: string;
  kind: T;
  valueTypes?: ValueType;
  options: (string | number)[];
  defaultValue: string | number;
  allowCustomInput?: boolean;
};

export type UiType = 'radio' | 'button';
type AlertFilterType = 'alertFilter';

export type FusionFilterOptions = {
  input: Record<AlertFilter['name'], UserInputOptions>;
};

export type UserInputOptions = Record<
  UserInputParam<UiType>['name'],
  UserInputParam<UiType>['options'][number]
>;
