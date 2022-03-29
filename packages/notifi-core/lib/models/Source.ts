import { Filter } from './Filter';

/**
 * Object describing a Source
 *
 * @remarks
 * Object describing a Source
 *
 * @property {string | null} id - Id of the Source
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string} type - Type of the source
 * @property {Filter[]} applicableFilters - The Filters which will work on this source
 *
 */
export type Source = Readonly<{
  id: string | null;
  name: string | null;
  type: string;
  blockchainAddress: string;
  applicableFilters: ReadonlyArray<Filter>;
}>;
