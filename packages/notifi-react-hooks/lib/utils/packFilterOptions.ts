import type { FilterOptions } from '@notifi-network/notifi-core';

const packFilterOptions = (
  clientOptions: Readonly<FilterOptions> | undefined,
): string => {
  if (clientOptions === undefined) {
    return '{}';
  }

  return JSON.stringify(clientOptions);
};

export default packFilterOptions;
