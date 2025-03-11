import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { SlackChannelTargetFragment } from '../fragments/SlackTargetFragment.gql';

export const DeleteSlackChannelTarget = gql`
  mutation deleteSlackChannelTarget($id: String!) {
    deleteSlackChannelTarget(input: { id: $id }) {
      slackChannelTarget {
        ...SlackChannelTargetFragment
      }
      errors {
        ...TargetAssignedToExistingTargetGroupErrorFragment
        ...UnexpectedErrorFragment
      }
    }
  }
  ${SlackChannelTargetFragment}
  ${ErrorFragments}
`;
