import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';
import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';
import { FilterFragment } from '../fragments/FilterFragment.gql';
import { SmsTargetFragment } from '../fragments/SmsTargetFragment.gql';
import { SourceFragment } from '../fragments/SourceFragment.gql';
import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';
import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';
import { TelegramTargetFragment } from '../fragments/TelegramTargetFragment.gql';

export const FetchData = gql`
  query fetchData {
    alert {
      ...AlertFragment
    }
    emailTarget {
      ...EmailTargetFragment
    }
    filter {
      ...FilterFragment
    }
    smsTarget {
      ...SmsTargetFragment
    }
    source {
      ...SourceFragment
    }
    sourceGroup {
      ...SourceGroupFragment
    }
    targetGroup {
      ...TargetGroupFragment
    }
    telegramTarget {
      ...TelegramTargetFragment
    }
  }
  ${AlertFragment}
  ${EmailTargetFragment}
  ${FilterFragment}
  ${SmsTargetFragment}
  ${SourceFragment}
  ${SourceGroupFragment}
  ${TargetGroupFragment}
  ${TelegramTargetFragment}
`;
