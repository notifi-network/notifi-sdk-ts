import { gql } from 'graphql-request';

import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';

export const DeleteSmsTarget = gql`
  mutation deleteSmsTarget($id: String!) {
    deleteSmsTarget(deleteTargetInput: { id: $id }) {
      ...SmsTargetFragment
    }
  }
  ${SmsTargetFragment}
`;
