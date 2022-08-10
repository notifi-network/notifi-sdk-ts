import { gql } from 'graphql-request';

import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';

export const GetTelegramTargets = gql`
  query getTelegramTargets {
    telegramTarget {
      ...TelegramTargetFragment
    }
  }
  ${TelegramTargetFragment}
`;
