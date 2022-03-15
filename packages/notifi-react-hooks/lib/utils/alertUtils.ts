import { Alert, FilterOptions } from '@notifi-network/notifi-core';

type HasFilterOptions = Pick<Alert, 'filterOptions'>;

const hasKey = <T, Key extends PropertyKey>(
  obj: T,
  key: Key,
): obj is T & Record<Key, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

const parseFilterOptions = (
  alert: HasFilterOptions,
): Readonly<FilterOptions> => {
  const filterOptions: FilterOptions = {};
  if (alert.filterOptions === null) {
    return filterOptions;
  }

  let jsonObject = {};
  try {
    jsonObject = JSON.parse(alert.filterOptions);
  } catch (e: unknown) {
    jsonObject = {};
  }

  if (
    hasKey(jsonObject, 'alertFrequency') &&
    (jsonObject.alertFrequency === 'ALWAYS' ||
      jsonObject.alertFrequency === 'SINGLE')
  ) {
    filterOptions.alertFrequency = jsonObject.alertFrequency;
  }

  if (
    hasKey(jsonObject, 'threshold') &&
    typeof jsonObject.threshold === 'string'
  ) {
    try {
      filterOptions.threshold = parseInt(jsonObject.threshold, 10);
    } catch (e: unknown) {
      filterOptions.threshold = NaN;
    }
  }

  if (
    hasKey(jsonObject, 'delayProcessingUntil') &&
    typeof jsonObject.delayProcessingUntil === 'string'
  ) {
    filterOptions.delayProcessingUntil = jsonObject.delayProcessingUntil;
  }

  return filterOptions;
};

const isAlertPaused = (alert: HasFilterOptions): boolean => {
  if (alert.filterOptions === null) {
    return false;
  }

  const filterOptions = parseFilterOptions(alert);
  if (filterOptions.delayProcessingUntil === undefined) {
    return false;
  }

  const delayProcessingUntil = Date.parse(filterOptions.delayProcessingUntil);
  return !isNaN(delayProcessingUntil) && delayProcessingUntil > Date.now();
};

const isAlertObsolete = (alert: HasFilterOptions): boolean => {
  if (alert.filterOptions === null) {
    return false;
  }

  const filterOptions = parseFilterOptions(alert);
  return filterOptions.alertFrequency === 'SINGLE' && isAlertPaused(alert);
};

export { isAlertObsolete, isAlertPaused };
