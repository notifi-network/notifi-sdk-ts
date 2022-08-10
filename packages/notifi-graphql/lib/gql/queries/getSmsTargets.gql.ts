import { gql } from 'graphql-request';

import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';

export const GetSmsTargets = gql`
  query getSmsTargets {
    smsTarget {
      ...SmsTargetFragment
    }
  }
  ${SmsTargetFragment}
`;
