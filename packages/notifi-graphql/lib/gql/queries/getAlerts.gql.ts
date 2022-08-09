import { AlertFragment } from '../fragments/AlertFragment.gql';
import { gql } from 'graphql-request';

export const GetAlerts = gql`
  query getAlerts {
    alert {
      ...AlertFragment
    }
  }
  ${AlertFragment}
`;
