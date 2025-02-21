import { gql } from 'graphql-request';

import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';

export const DeleteTelegramTarget = gql`
  mutation deleteTelegramTarget($id: String!) {
    deleteTelegramTarget(deleteTargetInput: { id: $id }) {
      ...TelegramTargetFragment
    }
  }
  ${TelegramTargetFragment}
`;
