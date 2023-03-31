import { Operation } from '../models';

export type DiscordTargetVerificationLinkInput = Readonly<{
  discordId: string;
}>;

export type GetDiscordVerificationLinkResult = Readonly<{
  discordTargetVerificationLink: string;
}>;

export type GetDiscordVerificationLinkService = Readonly<{
  getDiscordVerificationLink: Operation<
    DiscordTargetVerificationLinkInput,
    GetDiscordVerificationLinkResult
  >;
}>;
