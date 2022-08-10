import { gql } from 'graphql-request';

import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';

export const CreateEmailTarget = gql`
  mutation createEmailTarget($name: String!, $value: String!) {
    createEmailTarget(createTargetInput: { name: $name, value: $value }) {
      ...EmailTargetFragment
    }
  }
  ${EmailTargetFragment}
`;
