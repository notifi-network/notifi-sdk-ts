import { TargetGroup, Operation } from '../models';

export type CreateTargetGroupInput = Readonly<{
  name: string;
  emailTargetIds: string[];
  smsTargetIds: string[];
  telegramTargetIds: string[];
}>;

export type CreateTargetGroupResult = TargetGroup;

export type CreateTargetGroupService = Readonly<{
  createTargetGroup: Operation<CreateTargetGroupInput, CreateTargetGroupResult>;
}>;
