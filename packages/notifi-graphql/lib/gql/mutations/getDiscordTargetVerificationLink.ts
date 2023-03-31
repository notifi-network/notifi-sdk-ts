import { gql } from 'graphql-request';

export const GetDiscordTargetVerificationLink = gql`
  query DiscordTargetVerificationLink(
    $discordTargetVerificationLinkInput: DiscordTargetVerificationLinkInput!
  ) {
    discordTargetVerificationLink(
      discordTargetVerificationLinkInput: $discordTargetVerificationLinkInput
    )
  }
`;
