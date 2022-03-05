import { EmailTarget, ParameterLessOperation } from '../models';

export type GetEmailTargetsResult = ReadonlyArray<EmailTarget>;

export type GetEmailTargetsService = Readonly<{
  getEmailTargets: ParameterLessOperation<GetEmailTargetsResult>;
}>;
