import { gql } from 'graphql-request';

export const DiscordTargetFragment = gql`
  fragment DiscordTargetFragment on EmailTarget {
    id
    discordAccountId
    discriminator
    isConfirmed
    username
    name
  }
`;
