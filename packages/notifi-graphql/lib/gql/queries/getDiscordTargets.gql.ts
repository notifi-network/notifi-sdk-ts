import { gql } from 'graphql-request';

import { DiscordTargetFragment } from '../fragments/DiscordTargetFragment.gql';

export const GetDiscordTargets = gql`
  query getDiscordTargets {
    discordTarget {
      ...DiscordTargetFragment
    }
  }
  ${DiscordTargetFragment}
`;
