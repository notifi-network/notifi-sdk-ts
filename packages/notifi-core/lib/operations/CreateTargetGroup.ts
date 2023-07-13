import { Operation, TargetGroup } from '../models';

export type CreateTargetGroupInput = Readonly<{
  name: string;
  emailTargetIds: string[];
  smsTargetIds: string[];
  telegramTargetIds: string[];
  web3TargetIds: string[];
  webhookTargetIds: string[];
  discordTargetIds: string[];
}>;

export type CreateTargetGroupResult = TargetGroup;

export type CreateTargetGroupService = Readonly<{
  createTargetGroup: Operation<CreateTargetGroupInput, CreateTargetGroupResult>;
}>;
