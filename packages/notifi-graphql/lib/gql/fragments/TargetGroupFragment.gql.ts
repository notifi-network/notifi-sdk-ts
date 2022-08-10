import { gql } from 'graphql-request';

import { EmailTargetFragment } from './EmailTargetFragment.gql';
import { SmsTargetFragment } from './SmsTargetFragment.gql';
import { TelegramTargetFragment } from './TelegramTargetFragment.gql';

export const TargetGroupFragment = gql`
  fragment TargetGroupFragment on TargetGroup {
    id
    name
    emailTargets {
      ...EmailTargetFragment
    }
    smsTargets {
      ...SmsTargetFragment
    }
    telegramTargets {
      ...TelegramTargetFragment
    }
  }

  ${EmailTargetFragment}
  ${SmsTargetFragment}
  ${TelegramTargetFragment}
`;
