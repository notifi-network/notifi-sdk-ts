import { SourceGroup, Operation } from '../models';

export type CreateSourceGroupInput = Readonly<{
  name: string;
  sourceIds: ReadonlyArray<string>;
}>;

export type CreateSourceGroupResult = SourceGroup;

export type CreateSourceGroupService = Readonly<{
  createSourceGroup: Operation<CreateSourceGroupInput, CreateSourceGroupResult>;
}>;
