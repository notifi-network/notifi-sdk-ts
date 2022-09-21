import { gql } from 'graphql-request';

export const SmsTargetFragment = gql`
  fragment SmsTargetFragment on SmsTarget {
    id
    isConfirmed
    name
    phoneNumber
  }
`;
