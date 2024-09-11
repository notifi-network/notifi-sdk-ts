import { gql } from 'graphql-request';

import { VapidPublicKeyFragment } from '../fragments/VapidPublicKeyFragment.gql';

export const GetVapidPublicKeys = gql`
  query getVapidPublicKeys {
    vapidPublicKeys {
      pageInfo {
        ...PageInfoFragment
      }
      nodes {
        ...VapidPublicKeyFragment
      }
      edges {
        cursor
        node {
          ...VapidPublicKeyFragment
        }
      }
    }
  }
  ${VapidPublicKeyFragment}
`;
