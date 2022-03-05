import { SmsTarget, ParameterLessOperation } from '../models';

export type GetSmsTargetsResult = ReadonlyArray<SmsTarget>;

export type GetSmsTargetsService = Readonly<{
  getSmsTargets: ParameterLessOperation<GetSmsTargetsResult>;
}>;
