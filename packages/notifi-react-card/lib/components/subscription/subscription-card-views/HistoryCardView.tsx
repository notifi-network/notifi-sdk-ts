import {
  GetNotificationHistoryResult,
  NotificationHistoryEntry,
} from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../context';
import { BroadcastMessageChangedRenderer } from '../../AlertHistory/BroadcastMessageChangedRenderer';

export type AlertHistoryViewProps = Readonly<{
  alertHistoryTitle?: string;
  noAlertDescription?: string;
  notificationListHeight?: string;
  classNames?: Readonly<{
    title?: string;
    header?: string;
    dividerLine?: string;
    manageAlertLink?: string;
    noAlertDescription?: string;
    notificationDate?: string;
    notificationSubject?: string;
    notificationMessage?: string;
    notificationImage?: string;
    notificationList?: string;
  }>;
}>;

export const AlertCard = ({
  notification,
}: Readonly<{
  notification: NotificationHistoryEntry;
}>): React.ReactElement => {
  const detail = notification.detail;

  switch (detail?.__typename) {
    case 'BroadcastMessageEventDetails':
      return (
        <BroadcastMessageChangedRenderer
          createdDate={notification.createdDate}
          message={detail.message ?? ''}
          subject={detail.subject ?? ''}
        />
      );
    default:
  }
  return <></>;
};

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({
  alertHistoryTitle,
  classNames,
  noAlertDescription,
  notificationListHeight,
}) => {
  alertHistoryTitle = alertHistoryTitle ? alertHistoryTitle : 'Alert History';
  noAlertDescription = noAlertDescription
    ? noAlertDescription
    : 'No alerts have been sent to this subscription yet.';

  const { setCardView } = useNotifiSubscriptionContext();

  const handleBackClick = () => {
    setCardView({ state: 'preview' });
  };

  const { client } = useNotifiClientContext();

  const [alertHistoryData, setAlertHistoryData] =
    useState<GetNotificationHistoryResult>();
  useEffect(() => {
    client.getNotificationHistory({}).then((result) => {
      setAlertHistoryData(result);
    });
  }, [client]);

  return (
    <>
      <div className={clsx('NotifiAlertHistory__header', classNames?.header)}>
        <span className={clsx('NotifiAlertHistory__label', classNames?.title)}>
          {alertHistoryTitle}
        </span>
        <div
          className={clsx(
            'NotifiAlertHistory__manageAlertLink',
            classNames?.manageAlertLink,
          )}
          onClick={handleBackClick}
        >
          Manage Alerts
        </div>
      </div>
      <div
        className={clsx(
          'NotifiAlertHistory__dividerLine',
          classNames?.dividerLine,
        )}
      />
      {alertHistoryData?.nodes ? (
        <Virtuoso
          style={{
            height: notificationListHeight || '400px',
            maxWidth: '100%',
            marginBottom: '15px',
          }}
          data={alertHistoryData?.nodes}
          itemContent={(index, notification) => {
            return (
              <AlertCard key={notification.id} notification={notification} />
            );
          }}
        />
      ) : (
        <span
          className={clsx(
            'NotifiAlertHistory_noAlertDescription',
            classNames?.noAlertDescription,
          )}
        >
          {noAlertDescription}
        </span>
      )}
    </>
  );
};
