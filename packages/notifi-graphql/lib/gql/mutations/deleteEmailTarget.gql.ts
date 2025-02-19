import { gql } from 'graphql-request';

import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';

export const DeleteEmailTarget = gql`
  mutation deleteEmailTarget($id: String!) {
    deleteEmailTarget(deleteTargetInput: { id: $id }) {
      ...EmailTargetFragment
    }
  }
  ${EmailTargetFragment}
`;
