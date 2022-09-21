import { gql } from 'graphql-request';

export const TelegramTargetFragment = gql`
  fragment TelegramTargetFragment on TelegramTarget {
    id
    isConfirmed
    name
    telegramId
    confirmationUrl
  }
`;
