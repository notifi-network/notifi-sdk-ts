import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { VerifyCbwTargetResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const VerifyCbwTarget = gql`
  mutation verifyCbwTarget($input: VerifyCbwTargetInput!) {
    verifyCbwTarget(input: $input) {
      ...VerifyCbwTargetResponseFragment
      errors {
        ...Web3TargetNotFoundErrorFragment
        ...UnsupportedWeb3ProtocolErrorFragment
        ...UnverifiedXmtpTargetErrorFragment
      }
    }
  }
  ${VerifyCbwTargetResponseFragment}
  ${ErrorFragments}
`;
