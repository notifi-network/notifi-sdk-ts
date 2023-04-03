import { Operation } from '../models';

export type GetDiscordTargetVerificationLinkInput = Readonly<{
  discordTargetVerificationLinkInput: {
    discordTargetId: string;
  };
}>;

export type GetDiscordTargetVerificationLinkResult = Readonly<string>;

export type GetDiscordTargetVerificationLinkService = Readonly<{
  getDiscordTargetVerificationLink: Operation<
    GetDiscordTargetVerificationLinkInput,
    GetDiscordTargetVerificationLinkResult
  >;
}>;
