import { gql } from 'graphql-request';

import { DiscordTargetFragment } from '../fragments/DiscordTargetFragment.gql';

export const DeleteDiscordTarget = gql`
  mutation deleteDiscordTarget($id: String!) {
    deleteDiscordTarget(deleteTargetInput: { id: $id }) {
      ...DiscordTargetFragment
    }
  }
  ${DiscordTargetFragment}
`;
