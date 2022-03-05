import { Filter, ParameterLessOperation } from '../models';

export type GetFiltersResult = ReadonlyArray<Filter>;

export type GetFiltersService = Readonly<{
  getFilters: ParameterLessOperation<GetFiltersResult>;
}>;
