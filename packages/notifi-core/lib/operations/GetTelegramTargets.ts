import { ParameterLessOperation, TelegramTarget } from '../models';

export type GetTelegramTargetsResult = ReadonlyArray<TelegramTarget>;

export type GetTelegramTargetsService = Readonly<{
  getTelegramTargets: ParameterLessOperation<GetTelegramTargetsResult>;
}>;
