import { gql } from 'graphql-request';
import { VerifyCbwTargetResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const VerifyCbwTarget = gql`
  mutation verifyCbwTarget($input: VerifyCbwTargetInput!) {
    verifyCbwTarget(input: $input) {
      ...VerifyCbwTargetResponseFragment
    }
  }
  ${VerifyCbwTargetResponseFragment}
`;
