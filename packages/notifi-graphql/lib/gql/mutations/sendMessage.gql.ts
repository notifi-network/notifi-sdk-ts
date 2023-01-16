import { gql } from 'graphql-request';

export const SendMessage = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(sendMessageInput: $input)
  }
`;
