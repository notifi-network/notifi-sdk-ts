import React from 'react';

import { formatAmount } from '../../utils/AlertHistoryUtils';
import { AlertNotificationRow } from './AlertNotificationRow';

export type AccountBalanceChangedRendererProps = Readonly<{
  direction: string;
  previousValue: number;
  newValue: number;
  tokenSymbol: string;
  createdDate: string;
  walletAddress: string;
}>;

export const AccountBalanceChangedRenderer: React.FC<
  AccountBalanceChangedRendererProps
> = ({
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
    return `Wallet ID: ${walletAddress} account balance changed by ${changeAmount} ${tokenSymbol}`;
  };

  direction;
  return (
    <AlertNotificationRow
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
