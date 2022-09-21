import { gql } from 'graphql-request';

export const EmailTargetFragment = gql`
  fragment EmailTargetFragment on EmailTarget {
    emailAddress
    id
    isConfirmed
    name
  }
`;
