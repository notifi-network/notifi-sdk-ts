import { gql } from 'graphql-request';

import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';

export const GetTargetGroups = gql`
  query getTargetGroups {
    targetGroup {
      ...TargetGroupFragment
    }
  }
  ${TargetGroupFragment}
`;
