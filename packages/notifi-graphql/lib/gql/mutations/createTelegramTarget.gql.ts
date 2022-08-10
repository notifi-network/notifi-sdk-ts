import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';
import { gql } from 'graphql-request';

export const CreateTelegramTarget = gql`
  mutation createTelegramTarget($name: String!, $value: String!) {
    createTelegramTarget(createTargetInput: { name: $name, value: $value }) {
      ...TelegramTargetFragment
    }
  }
  ${TelegramTargetFragment}
`;
