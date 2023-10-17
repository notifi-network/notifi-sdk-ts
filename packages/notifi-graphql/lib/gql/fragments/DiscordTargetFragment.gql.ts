import { gql } from 'graphql-request';

export const DiscordTargetFragment = gql`
  fragment DiscordTargetFragment on DiscordTarget {
    id
    discordAccountId
    discriminator
    isConfirmed
    username
    name
    userStatus
    verificationLink
    discordServerInviteLink
  }
`;
