import { NotificationHistoryEntry } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import { useNotificationHistory } from 'notifi-react-card/lib/hooks/useNotificationHistory';
import React, { useMemo } from 'react';

import { formatAlertDetailsTimestamp } from '../../utils/AlertHistoryUtils';

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
  const { getAlertDetailsContents } = useNotificationHistory();
  const detailsContents = useMemo(
    () => getAlertDetailsContents(notificationEntry),
    [notificationEntry],
  );
  return (
    <div
      className={clsx(
        'NotifiAlertDetails__container',
        classNames?.detailsContainer,
      )}
    >
      <div className={clsx('NotifiAlertDetails__topContentContainer')}>
        <div className={clsx('NotifiAlertDetails__topContent')}>
          {detailsContents.topContent}
        </div>
        <div className={clsx('NotifiAlertDetails__timestamp')}>
          {formatAlertDetailsTimestamp(notificationEntry.createdDate)}
        </div>
      </div>
      <div className={clsx('NotifiAlertDetails__bottomContent')}>
        <div>{detailsContents.bottomContent}</div>
        <div>{detailsContents.otherContent}</div>
      </div>
    </div>
  );
};
