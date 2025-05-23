import { gql } from 'graphql-request';

import { FilterFragment } from './FilterFragment.gql';
import { SourceGroupFragment } from './SourceGroupFragment.gql';
import { TargetGroupFragment } from './TargetGroupFragment.gql';

export const AlertFragment = gql`
  fragment AlertFragment on Alert {
    id
    groupName
    name
    filterOptions
    targetGroup {
      ...TargetGroupFragment
    }
    subscriptionValue
    fusionEventId
  }
  ${FilterFragment}
  ${SourceGroupFragment}
  ${TargetGroupFragment}
`;
