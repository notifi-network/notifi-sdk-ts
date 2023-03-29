import { DiscordTarget, Operation } from '../models';

/**
 * Input param for creating an DiscordTarget
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
export type CreateDiscordTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateDiscordTargetResult = DiscordTarget;

export type CreateDiscordTargetService = Readonly<{
  createDiscordTarget: Operation<
    CreateDiscordTargetInput,
    CreateDiscordTargetResult
  >;
}>;
