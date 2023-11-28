import { gql } from 'graphql-request';

import { FilterFragment } from './FilterFragment.gql';
import { SourceGroupFragment } from './SourceGroupFragment.gql';

export const TenantUserAlertFragment = gql`
  ${FilterFragment}
  ${SourceGroupFragment}

  fragment TenantUserAlertFragment on TenantUserAlert {
    id
    name
    groupName
    filterOptions
    filter {
      ...FilterFragment
    }
    sourceGroup {
      ...SourceGroupFragment
    }
    targetGroup {
      hasVerifiedFcm
      hasVerifiedSms
      hasVerifiedWeb3
      hasVerifiedEmails
      hasVerifiedWebhook
      hasVerifiedDiscord
      hasVerifiedTelegram
    }
  }
`;
