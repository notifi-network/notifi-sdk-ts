import { gql } from 'graphql-request';

import { DiscordTargetFragment } from './DiscordTargetFragment.gql';
import { EmailTargetFragment } from './EmailTargetFragment.gql';
import { SlackChannelTargetFragment } from './SlackTargetFragment.gql';
import { SmsTargetFragment } from './SmsTargetFragment.gql';
import { TelegramTargetFragment } from './TelegramTargetFragment.gql';
import { Web3TargetFragment } from './Web3TargetFragment.gql';

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
    discordTargets {
      ...DiscordTargetFragment
    }
    slackChannelTargets {
      ...SlackChannelTargetFragment
    }
    web3Targets {
      ...Web3TargetFragment
    }
  }

  ${EmailTargetFragment}
  ${SmsTargetFragment}
  ${TelegramTargetFragment}
  ${DiscordTargetFragment}
  ${SlackChannelTargetFragment}
  ${Web3TargetFragment}
`;
