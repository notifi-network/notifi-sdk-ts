import { Operation } from '../models';

export type DeleteTargetGroupInput = Readonly<{
  id: string;
}>;
export type DeleteTargetGroupResult = Readonly<{
  id: string;
}>;

export type DeleteTargetGroupService = Readonly<{
  deleteTargetGroup: Operation<DeleteTargetGroupInput, DeleteTargetGroupResult>;
}>;
