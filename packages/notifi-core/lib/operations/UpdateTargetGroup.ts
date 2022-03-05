import { TargetGroup, Operation } from '../models';

export type UpdateTargetGroupInput = Readonly<{
  id: string;
  name: string;
  emailTargetIds: string[];
  smsTargetIds: string[];
  telegramTargetIds: string[];
}>;

export type UpdateTargetGroupResult = TargetGroup;

export type UpdateTargetGroupService = Readonly<{
  updateTargetGroup: Operation<UpdateTargetGroupInput, UpdateTargetGroupResult>;
}>;
