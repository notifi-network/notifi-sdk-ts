import type { FilterOptions } from '@notifi-network/notifi-core';

const packFilterOptions = (
  clientOptions: Readonly<FilterOptions> | undefined,
): string => {
  const record: Record<string, string> = {};

  if (clientOptions !== undefined) {
    const { alertFrequency, directMessageType, threshold } = clientOptions;

    if (alertFrequency !== undefined) {
      record.alertFrequency = alertFrequency;
    }

    if (directMessageType !== undefined) {
      record.directMessageType = directMessageType;
    }

    if (threshold !== undefined) {
      record.threshold = threshold.toString();
    }
  }

  return JSON.stringify(record);
};

export default packFilterOptions;
