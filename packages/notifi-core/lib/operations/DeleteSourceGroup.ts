import { Operation } from '../models';

export type DeleteSourceGroupInput = Readonly<{
  id: string;
}>;
export type DeleteSourceGroupResult = Readonly<{
  id: string;
}>;

export type DeleteSourceGroupService = Readonly<{
  deleteSourceGroup: Operation<DeleteSourceGroupInput, DeleteSourceGroupResult>;
}>;
