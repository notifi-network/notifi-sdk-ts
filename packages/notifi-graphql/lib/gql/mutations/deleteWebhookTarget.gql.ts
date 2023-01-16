import { gql } from 'graphql-request';

export const DeleteWebhookTarget = gql`
  mutation deleteWebhookTarget($id: String!) {
    deleteWebhookTarget(deleteTargetInput: { id: $id }) {
      id
    }
  }
`;
