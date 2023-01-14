import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';

export const CreateDirectPushAlert = gql`
  ${AlertFragment}
  mutation createDirectPushAlert($input: CreateDirectPushAlertInput!) {
    createDirectPushAlert(createDirectPushAlertInput: $input) {
      ...AlertFragment
    }
  }
`;
