import { gql } from 'graphql-request';

import { CreateSlackChannelTargetResponseFragment } from '../fragments/SlackTargetFragment.gql';

export const CreateSlackChannelTarget = gql`
  mutation createSlackChannelTarget($name: String!, $value: String!) {
    createSlackChannelTarget(input: { name: $name, value: $value }) {
      ...CreateSlackChannelTargetResponseFragment
    }
  }
  ${CreateSlackChannelTargetResponseFragment}
`;
