import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';
import { ConnectedWalletFragment } from '../fragments/ConnectedWalletFragment.gql';
import { DiscordTargetFragment } from '../fragments/DiscordTargetFragment.gql';
import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';
import { FilterFragment } from '../fragments/FilterFragment.gql';
import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';
import { SourceFragment } from '../fragments/SourceFragment.gql';
import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';
import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';
import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';

export const fetchData = gql`
  query fetchData {
    alert {
      ...AlertFragment
    }
    sourceGroup {
      ...SourceGroupFragment
    }
    connectedWallet {
      ...ConnectedWalletFragment
    }
    source {
      ...SourceFragment
    }
    targetGroup {
      ...TargetGroupFragment
    }
    emailTarget {
      ...EmailTargetFragment
    }
    smsTarget {
      ...SmsTargetFragment
    }
    telegramTarget {
      ...TelegramTargetFragment
    }
    discordTarget {
      ...DiscordTargetFragment
    }
    filter {
      ...FilterFragment
    }
  }
  ${SourceGroupFragment}
  ${AlertFragment}
  ${ConnectedWalletFragment}
  ${SourceFragment}
  ${TargetGroupFragment}
  ${EmailTargetFragment}
  ${SmsTargetFragment}
  ${TelegramTargetFragment}
  ${DiscordTargetFragment}
  ${FilterFragment}
`;
