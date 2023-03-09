import React from 'react';

import { SwapIcon } from '../../assets/SwapIcon';
import { formatAmount } from '../../utils/AlertHistoryUtils';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

export type AccountBalanceChangedRendererProps = Readonly<{
  direction: string;
  previousValue: number;
  newValue: number;
  tokenSymbol: string;
  createdDate: string;
  walletAddress: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>;

export const AccountBalanceChangedRenderer: React.FC<
  AccountBalanceChangedRendererProps
> = ({
  classNames,
  handleAlertEntrySelection,
  direction,
  previousValue,
  newValue,
  tokenSymbol,
  createdDate,
  walletAddress,
}) => {
  const changeAmount = formatAmount(Math.abs(previousValue - newValue));

  const getTitle = () => {
    return direction === 'INCOMING'
      ? `Incoming Transaction: ${changeAmount} ${tokenSymbol}`
      : `Outgoing Transaction: ${changeAmount} ${tokenSymbol}`;
  };

  const getMessage = () => {
    return `Wallet ${walletAddress} account balance changed by ${changeAmount} ${tokenSymbol}`;
  };

  direction;
  return (
    <AlertNotificationRow
      classNames={classNames}
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationImage={<SwapIcon />}
      notificationTitle={getTitle()}
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
