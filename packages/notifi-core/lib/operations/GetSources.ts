import { Source, ParameterLessOperation } from '../models';

export type GetSourcesResult = ReadonlyArray<Source>;

export type GetSourcesService = Readonly<{
  getSources: ParameterLessOperation<GetSourcesResult>;
}>;
