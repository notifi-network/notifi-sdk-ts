import { gql } from 'graphql-request';

export const ErrorFragments = gql`
  fragment ArgumentErrorFragment on ArgumentError {
    __typename
    message
    paramName
  }

  fragment ArgumentNullErrorFragment on ArgumentNullError {
    __typename
    message
    paramName
  }

  fragment ArgumentOutOfRangeErrorFragment on ArgumentOutOfRangeError {
    __typename
    message
    paramName
  }

  fragment TargetDoesNotExistErrorFragment on TargetDoesNotExistError {
    __typename
    message
  }

  fragment UnexpectedErrorFragment on UnexpectedError {
    __typename
    message
  }

  fragment TargetLimitExceededErrorFragment on TargetLimitExceededError {
    __typename
    message
  }

  fragment TargetAssignedToExistingTargetGroupErrorFragment on TargetAssignedToExistingTargetGroupError {
    __typename
    message
  }
`;
