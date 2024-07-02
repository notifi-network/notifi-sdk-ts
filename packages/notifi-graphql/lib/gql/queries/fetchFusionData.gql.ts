import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';
import { ConnectedWalletFragment } from '../fragments/ConnectedWalletFragment.gql';
import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';

export const fetchFusionData = gql`
  query fetchFusionData {
    alert {
      ...AlertFragment
    }
    connectedWallet {
      ...ConnectedWalletFragment
    }
    targetGroup {
      ...TargetGroupFragment
    }
  }
  ${AlertFragment}
  ${ConnectedWalletFragment}
  ${TargetGroupFragment}
`;
