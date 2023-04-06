import { gql } from 'graphql-request';

import { DiscordTargetFragment } from '../fragments/DiscordTargetFragment.gql';

export const CreateDiscordTarget = gql`
  mutation createDiscordTarget($value: String!) {
    createDiscordTarget(createTargetInput: { value: $value }) {
      ...DiscordTargetFragment
    }
  }
  ${DiscordTargetFragment}
`;
