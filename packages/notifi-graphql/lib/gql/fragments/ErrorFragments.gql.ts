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

  fragment DuplicateSlackChannelTargetNamesErrorFragment on DuplicateSlackChannelTargetNamesError {
    __typename
    message
  }

  fragment InvalidEmailErrorFragment on InvalidEmailError {
    __typename
    message
  }

  fragment InvalidOperationErrorFragment on InvalidOperationError {
    __typename
    message
  }

  fragment InvalidXmtpConsentProofErrorFragment on InvalidXmtpConsentProofError {
    __typename
    message
  }

  fragment LimitedResourceTypeErrorFragment on LimitedResourceTypeError {
    __typename
    message
  }

  fragment RequiresElevatedTokenErrorFragment on RequiresElevatedTokenError {
    __typename
    message
  }

  fragment UnauthorizedAccessErrorFragment on UnauthorizedAccessError {
    __typename
    message
  }

  fragment UnauthorizedXmtpAccountErrorFragment on UnauthorizedXmtpAccountError {
    __typename
    message
  }

  fragment UnsupportedWeb3ProtocolErrorFragment on UnsupportedWeb3ProtocolError {
    __typename
    message
  }

  fragment UnverifiedXmtpTargetErrorFragment on UnverifiedXmtpTargetError {
    __typename
    message
  }

  fragment Web3TargetNotFoundErrorFragment on Web3TargetNotFoundError {
    __typename
    message
  }

  fragment XmtpAccountIsntConnectedWalletErrorFragment on XmtpAccountIsntConnectedWalletError {
    __typename
    message
  }
`;
