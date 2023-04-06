import { gql } from 'graphql-request';

import { DiscordTargetFragment } from '../fragments/DiscordTargetFragment.gql';

export const CreateDiscordTarget = gql`
  mutation createDiscordTarget($name: String!, $value: String!) {
    createDiscordTarget(createTargetInput: { name: $name, value: $value }) {
      ...DiscordTargetFragment
    }
  }
  ${DiscordTargetFragment}
`;
