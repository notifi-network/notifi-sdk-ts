import { SmsTarget, Operation } from '../models';

export type CreateSmsTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateSmsTargetResult = SmsTarget;

export type CreateSmsTargetService = Readonly<{
  createSmsTarget: Operation<CreateSmsTargetInput, CreateSmsTargetResult>;
}>;
