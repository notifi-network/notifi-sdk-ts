import { EmailTarget, Operation } from '../models';

export type CreateEmailTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateEmailTargetResult = EmailTarget;

export type CreateEmailTargetService = Readonly<{
  createEmailTarget: Operation<CreateEmailTargetInput, CreateEmailTargetResult>;
}>;
