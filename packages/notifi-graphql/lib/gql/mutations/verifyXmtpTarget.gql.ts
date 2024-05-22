import { gql } from 'graphql-request';
import { VerifyXmtpTargetResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const VerifyXmtpTarget = gql`
  mutation verifyXmtpTarget($input: VerifyXmtpTargetInput!) {
    verifyXmtpTarget(input: $input) {
      ...VerifyXmtpTargetResponseFragment 
    }
  }
  ${VerifyXmtpTargetResponseFragment}
`;
