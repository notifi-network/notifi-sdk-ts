import { EmailTarget, Operation } from '../models';

/**
 * Input param for creating an EmailTarget
 *
 * @remarks
 * This describes the values to use for email target
 *
 * @property sourceGroupId - The id from the SourceGroup that should be monitored
 * @property filterId - The id of the Filter that should be applied to the Alert
 * @property targetGroupId - The id of the TargetGroup that the Alert should publish to
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type CreateEmailTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateEmailTargetResult = EmailTarget;

export type CreateEmailTargetService = Readonly<{
  createEmailTarget: Operation<CreateEmailTargetInput, CreateEmailTargetResult>;
}>;
