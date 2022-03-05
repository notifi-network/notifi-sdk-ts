import { TelegramTarget, Operation } from '../models';

export type CreateTelegramTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateTelegramTargetResult = TelegramTarget;

export type CreateTelegramTargetService = Readonly<{
  createTelegramTarget: Operation<
    CreateTelegramTargetInput,
    CreateTelegramTargetResult
  >;
}>;
