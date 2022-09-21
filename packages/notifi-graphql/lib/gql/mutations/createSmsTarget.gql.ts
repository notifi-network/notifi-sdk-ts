import { gql } from 'graphql-request';

import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';

export const CreateSmsTarget = gql`
  mutation createSmsTarget($name: String!, $value: String!) {
    createSmsTarget(createTargetInput: { name: $name, value: $value }) {
      ...SmsTargetFragment
    }
  }
  ${SmsTargetFragment}
`;
