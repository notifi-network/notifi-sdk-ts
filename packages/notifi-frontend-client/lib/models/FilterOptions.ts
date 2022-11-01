export type AlertFrequency =
  | 'ALWAYS'
  | 'SINGLE'
  | 'QUARTER_HOUR'
  | 'HOURLY'
  | 'DAILY';

export type ValueItemConfig = Readonly<{
  key: string;
  op: 'lt' | 'lte' | 'eq' | 'gt' | 'gte';
  value: string;
}>;

export type FilterOptions = Partial<{
  alertFrequency: AlertFrequency;
  directMessageType: string;
  threshold: number;
  delayProcessingUntil: string;
  values: Readonly<
    | { and: ReadonlyArray<ValueItemConfig> }
    | { or: ReadonlyArray<ValueItemConfig> }
  >;
}>;
