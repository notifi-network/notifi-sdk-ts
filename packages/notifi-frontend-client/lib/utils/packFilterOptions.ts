import type { FilterOptions } from '../models';

export const packFilterOptions = (
  clientOptions: Readonly<FilterOptions> | null,
): string => {
  if (clientOptions === null) {
    return '{}';
  }

  return JSON.stringify(clientOptions);
};
