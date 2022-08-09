import { FilterFragment } from './FilterFragment.gql';
import { SourceGroupFragment } from './SourceGroupFragment.gql';
import { TargetGroupFragment } from './TargetGroupFragment.gql';
import { gql } from 'graphql-request';

export const AlertFragment = gql`
  fragment AlertFragment on Alert {
    id
    groupName
    name
    filterOptions
    filter {
      ...FilterFragment
    }
    sourceGroup {
      ...SourceGroupFragment
    }
    targetGroup {
      ...TargetGroupFragment
    }
  }
  ${FilterFragment}
  ${SourceGroupFragment}
  ${TargetGroupFragment}
`;
