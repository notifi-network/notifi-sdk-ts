import { gql } from 'graphql-request';

import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';

export const CreateTelegramTarget = gql`
  mutation createTelegramTarget($name: String!, $value: String!) {
    createTelegramTarget(createTargetInput: { name: $name, value: $value }) {
      ...TelegramTargetFragment
    }
  }
  ${TelegramTargetFragment}
`;
