import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetDiscordVerificationLinkResult } from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];
const QUERY = `
query DiscordTargetVerificationLink(
  $discordTargetVerificationLinkInput: DiscordTargetVerificationLinkInput!
) {
  discordTargetVerificationLink(
    discordTargetVerificationLinkInput: $discordTargetVerificationLinkInput
  )
}

`.trim();

const getDiscordVerificationLinkImpl =
  makeParameterLessRequest<GetDiscordVerificationLinkResult>(
    collectDependencies(...DEPENDENCIES, QUERY),
    'discordTargetVerificationLink',
  );

export default getDiscordVerificationLinkImpl;
