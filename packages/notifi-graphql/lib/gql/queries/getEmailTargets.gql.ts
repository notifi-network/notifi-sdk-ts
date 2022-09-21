import { gql } from 'graphql-request';

import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';

export const GetEmailTargets = gql`
  query getEmailTargets {
    emailTarget {
      ...EmailTargetFragment
    }
  }
  ${EmailTargetFragment}
`;
