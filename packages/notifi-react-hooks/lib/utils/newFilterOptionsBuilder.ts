import type {
  AlertFrequency,
  FilterOptionsBuilder,
} from '@notifi-network/notifi-core';

type FilterOptions = Partial<{
  [filterOptionsKey in 'alertFrequency' | 'threshold']: string;
}>;

class FilterOptionsBuilderImpl implements FilterOptionsBuilder {
  private fields: FilterOptions = {};

  withAlertFrequency(alertFrequency: AlertFrequency): FilterOptionsBuilder {
    this.fields.alertFrequency = alertFrequency;
    return this;
  }

  withThreshold(threshold: number): FilterOptionsBuilder {
    this.fields.threshold = threshold.toString();
    return this;
  }

  toJsonString(): string {
    return JSON.stringify(this.fields);
  }
}

const newFilterOptionsBuilder = (): FilterOptionsBuilder => {
  return new FilterOptionsBuilderImpl();
};

export default newFilterOptionsBuilder;
