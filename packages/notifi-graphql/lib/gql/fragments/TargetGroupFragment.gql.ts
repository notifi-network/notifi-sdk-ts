import { gql } from 'graphql-request';

import { DiscordTargetFragment } from './DiscordTargetFragment.gql';
import { EmailTargetFragment } from './EmailTargetFragment.gql';
import { SmsTargetFragment } from './SmsTargetFragment.gql';
import { TelegramTargetFragment } from './TelegramTargetFragment.gql';
import { WebhookTargetFragment } from './WebhookTargetFragment.gql';

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
    webhookTargets {
      ...WebhookTargetFragment
    }
    discordTargets {
      ...DiscordTargetFragment
    }
  }

  ${EmailTargetFragment}
  ${SmsTargetFragment}
  ${TelegramTargetFragment}
  ${WebhookTargetFragment}
  ${DiscordTargetFragment}
`;
