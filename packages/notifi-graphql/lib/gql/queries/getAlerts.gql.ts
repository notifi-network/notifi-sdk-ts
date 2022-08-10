import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';

export const GetAlerts = gql`
  query getAlerts {
    alert {
      ...AlertFragment
    }
  }
  ${AlertFragment}
`;
