import { TargetGroup, ParameterLessOperation } from '../models';

export type GetTargetGroupsResult = ReadonlyArray<TargetGroup>;

export type GetTargetGroupsService = Readonly<{
  getTargetGroups: ParameterLessOperation<GetTargetGroupsResult>;
}>;
