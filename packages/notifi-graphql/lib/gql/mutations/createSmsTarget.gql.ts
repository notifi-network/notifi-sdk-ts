import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';
import { gql } from 'graphql-request';

export const CreateSmsTarget = gql`
  mutation createSmsTarget($name: String!, $value: String!) {
    createSmsTarget(createTargetInput: { name: $name, value: $value }) {
      ...SmsTargetFragment
    }
  }
  ${SmsTargetFragment}
`;
