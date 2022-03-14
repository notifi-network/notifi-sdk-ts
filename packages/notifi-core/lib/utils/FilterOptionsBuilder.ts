export type AlertFrequency = 'ALWAYS' | 'SINGLE';

export interface FilterOptionsBuilder {
  withAlertFrequency(alertFrequency: AlertFrequency): FilterOptionsBuilder;
  withThreshold(threshold: number): FilterOptionsBuilder;
  toJsonString(): string;
}
