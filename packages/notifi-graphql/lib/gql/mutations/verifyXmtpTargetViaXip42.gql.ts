import { gql } from 'graphql-request';
import { VerifyXmtpTargetViaXip42ResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const VerifyXmtpTargetViaXip42 = gql`
  mutation verifyXmtpTargetViaXip42($input: VerifyXmtpTargetViaXip42Input!) {
    verifyXmtpTargetViaXip42(input: $input) {
      ...VerifyXmtpTargetViaXip42ResponseFragment 
    }
  }
  ${VerifyXmtpTargetViaXip42ResponseFragment}
`;
