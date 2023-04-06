import { DiscordTarget, Operation } from '../models';

/**
 * Input param for creating an DiscordTarget
 *
 * @remarks
 * This describes the values to use for discord target
 */

export type CreateDiscordTargetInput = Readonly<{
  value: string;
}>;

export type CreateDiscordTargetResult = DiscordTarget;

export type CreateDiscordTargetService = Readonly<{
  createDiscordTarget: Operation<
    CreateDiscordTargetInput,
    CreateDiscordTargetResult
  >;
}>;
