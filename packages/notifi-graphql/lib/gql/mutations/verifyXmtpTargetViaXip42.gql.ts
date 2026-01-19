import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { VerifyXmtpTargetViaXip42ResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const VerifyXmtpTargetViaXip42 = gql`
  mutation verifyXmtpTargetViaXip42($input: VerifyXmtpTargetViaXip42Input!) {
    verifyXmtpTargetViaXip42(input: $input) {
      ...VerifyXmtpTargetViaXip42ResponseFragment
      errors {
        ...Web3TargetNotFoundErrorFragment
        ...UnauthorizedXmtpAccountErrorFragment
        ...UnsupportedWeb3ProtocolErrorFragment
        ...XmtpAccountIsntConnectedWalletErrorFragment
      }
    }
  }
  ${VerifyXmtpTargetViaXip42ResponseFragment}
  ${ErrorFragments}
`;
