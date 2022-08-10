import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';
import { gql } from 'graphql-request';

export const CreateEmailTarget = gql`
  mutation createEmailTarget($name: String!, $value: String!) {
    createEmailTarget(createTargetInput: { name: $name, value: $value }) {
      ...EmailTargetFragment
    }
  }
  ${EmailTargetFragment}
`;
