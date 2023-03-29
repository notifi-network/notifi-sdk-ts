import { DiscordTarget, ParameterLessOperation } from '../models';

export type GetDiscordTargetsResult = ReadonlyArray<DiscordTarget>;

export type GetDiscordTargetsService = Readonly<{
  getDiscordTargets: ParameterLessOperation<GetDiscordTargetsResult>;
}>;
