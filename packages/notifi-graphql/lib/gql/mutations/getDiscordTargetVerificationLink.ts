import { gql } from 'graphql-request';

export const GetDiscordTargetVerificationLink = gql`
  query discordTargetVerificationLink(
    $discordTargetVerificationLinkInput: DiscordTargetVerificationLinkInput!
  ) {
    discordTargetVerificationLink(
      discordTargetVerificationLinkInput: $discordTargetVerificationLinkInput
    )
  }
`;
