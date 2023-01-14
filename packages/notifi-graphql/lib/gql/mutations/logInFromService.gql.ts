import { gql } from 'graphql-request';

import { AuthorizationFragment } from '../fragments/AuthorizationFragment.gql';

export const logInFromService = gql`
  ${AuthorizationFragment}

  mutation logInFromService($input: ServiceLogInInput!) {
    logInFromService(serviceLogInInput: $input) {
      ...AuthorizationFragment
    }
  }
`;
