import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetDiscordTargetVerificationLinkInput,
  GetDiscordTargetVerificationLinkResult,
} from '@notifi-network/notifi-core';

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

const GetDiscordTargetVerificationLinkImpl = makeRequest<
  GetDiscordTargetVerificationLinkInput,
  GetDiscordTargetVerificationLinkResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'discordTargetVerificationLink');

export default GetDiscordTargetVerificationLinkImpl;
