import { Operation, SourceGroup } from '../models';

export type UpdateSourceGroupInput = Readonly<{
  id: string;
  name: string;
  sourceIds: ReadonlyArray<string>;
}>;

export type UpdateSourceGroupResult = SourceGroup;

export type UpdateSourceGroupService = Readonly<{
  updateSourceGroup: Operation<UpdateSourceGroupInput, UpdateSourceGroupResult>;
}>;
