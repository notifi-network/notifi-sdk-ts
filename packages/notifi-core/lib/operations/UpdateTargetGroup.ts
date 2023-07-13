import { Operation, TargetGroup } from '../models';

export type UpdateTargetGroupInput = Readonly<{
  id: string;
  name: string;
  emailTargetIds: string[];
  smsTargetIds: string[];
  telegramTargetIds: string[];
  discordTargetIds: string[];
  web3TargetIds: string[];
}>;

export type UpdateTargetGroupResult = TargetGroup;

export type UpdateTargetGroupService = Readonly<{
  updateTargetGroup: Operation<UpdateTargetGroupInput, UpdateTargetGroupResult>;
}>;
