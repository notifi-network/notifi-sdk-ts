import { SourceGroup, ParameterLessOperation } from '../models';

export type GetSourceGroupsResult = ReadonlyArray<SourceGroup>;

export type GetSourceGroupsService = Readonly<{
  getSourceGroups: ParameterLessOperation<GetSourceGroupsResult>;
}>;
