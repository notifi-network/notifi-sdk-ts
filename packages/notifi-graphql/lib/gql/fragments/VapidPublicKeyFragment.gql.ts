import { gql } from 'graphql-request';

export const VapidPublicKeyFragment = gql`
  fragment VapidPublicKeyFragment on VapidPublicKey {
    publicKey
  }
`;
