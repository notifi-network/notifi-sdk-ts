import { NotificationHistoryEntry } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import {
  formatAlertDetailsTimestamp,
  formatAmount,
} from '../../utils/AlertHistoryUtils';

export type AlertDetailsProps = Readonly<{
  notificationEntry: NotificationHistoryEntry;
  classNames?: Readonly<{
    detailsContainer?: string;
    BackArrowIcon?: string;
  }>;
}>;
export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
}) => {
  const timestamp = notificationEntry.createdDate;
  const content = useMemo(() => {
    const detail = notificationEntry?.detail;
    const typename = detail?.__typename;
    if (detail === undefined || typename === undefined) {
      return {};
    }

    // TODO: Deduplicate with HistoryCardView
    switch (typename) {
      case 'BroadcastMessageEventDetails': {
        return {
          topContent: detail.subject,
          bottomContent: detail.message,
        };
      }
      case 'HealthValueOverThresholdEventDetails': {
        return {
          topContent: detail.name,
          bottomContent: (
            <>
              <div>{`value: ${detail.value}`}</div>
              &nbsp;
              <div>{`threshold: ${detail.threshold}`}</div>
            </>
          ),
        };
      }
      case 'GenericEventDetails': {
        return {
          topContent: detail.notificationTypeName,
          bottomContent: detail.genericMessage,
        };
      }
      case 'ChatMessageReceivedEventDetails': {
        return {
          topContent: `New Message from ${detail.senderName}`,
          bottomContent: detail.messageBody,
        };
      }
      case 'AccountBalanceChangedEventDetails': {
        const changeAmount = `${formatAmount(
          Math.abs(detail.previousValue - detail.newValue),
        )}`;
        return {
          topContent:
            detail.direction === 'INCOMING'
              ? `Incoming Transaction: ${changeAmount}  ${detail.tokenSymbol}`
              : `Outgoing Transaction: ${changeAmount}  ${detail.tokenSymbol}`,
          bottomContent: `Wallet ${notificationEntry.sourceAddress} account balance changed by ${changeAmount} ${detail.tokenSymbol}`,
        };
      }
    }

    return {};
  }, []);
  return (
    <div
      className={clsx(
        'NotifiAlertDetails__container',
        classNames?.detailsContainer,
      )}
    >
      <div className={clsx('NotifiAlertDetails__topContentContainer')}>
        <div className={clsx('NotifiAlertDetails__topContent')}>
          {content.topContent}
        </div>
        <div className={clsx('NotifiAlertDetails__timestamp')}>
          {formatAlertDetailsTimestamp(timestamp)}
        </div>
      </div>
      <div className={clsx('NotifiAlertDetails__bottomContent')}>
        {content.bottomContent}
      </div>
    </div>
  );
};
