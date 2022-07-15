import { EmailTarget, Operation } from '../models';

export type SendEmailTargetVerificationRequestInput = Readonly<{
  targetId: string;
}>;

export type SendEmailTargetVerificationRequestResult = EmailTarget;

export type SendEmailTargetVerificationRequestService = Readonly<{
  sendEmailTargetVerificationRequest: Operation<
    SendEmailTargetVerificationRequestInput,
    EmailTarget
  >;
}>;
