import { ParameterLessOperation, SmsTarget } from '../models';

export type GetSmsTargetsResult = ReadonlyArray<SmsTarget>;

export type GetSmsTargetsService = Readonly<{
  getSmsTargets: ParameterLessOperation<GetSmsTargetsResult>;
}>;
