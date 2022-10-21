import { GetNotificationHistoryResult } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import { BroadcastMessageChangedRenderer } from 'notifi-react-card/lib/AlertHistory/BroadcastMessageChangedRenderer';
import React, { useCallback, useState } from 'react';

import { NotificationTypeName } from '../../../../../notifi-axios-adapter/lib/fragments/notificationHistoryEntryFragment';
import { useNotifiSubscriptionContext } from '../../../context';
import { useAlertHistory } from '../../../hooks/useAlertHistory';
import { AlertNotificationRow } from './AlertNotificationRow';

export type AlertHistoryViewProps = Readonly<{
  alertHistoryTitle?: string;
  noAlertDescription?: string;
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
  }>;
}>;

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({
  alertHistoryTitle,
  classNames,
  noAlertDescription,
}) => {
  alertHistoryTitle = alertHistoryTitle ? alertHistoryTitle : 'Alert History';
  noAlertDescription = noAlertDescription
    ? noAlertDescription
    : 'No alerts have been sent to this subscription yet.';

  const { setCardView } = useNotifiSubscriptionContext();

  const handleBackClick = () => {
    setCardView({ state: 'preview' });
  };

  const [alertHistoryData, setAlertHistoryData] =
    useState<GetNotificationHistoryResult>();
  const { getNotifiAlertHistory } = useAlertHistory({});
  const notifiAlertHistory = useCallback(async () => {
    const notifiAlertHistory = await getNotifiAlertHistory();
    setAlertHistoryData(notifiAlertHistory);
  }, []);

  notifiAlertHistory();

  return (
    <>
      <div
        className={clsx(
          'NotifiAlertHistory__notificationRow',
          classNames?.header,
        )}
      >
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
      ></div>
      {alertHistoryData ? (
        <div>
          {alertHistoryData?.nodes?.map((notification) => {
            if (
              notification?.detail?.__typename ===
              NotificationTypeName.BROADCAST_MESSAGE
            ) {
              return (
                <BroadcastMessageChangedRenderer
                  createdDate={notification?.createdDate}
                  message={notification?.detail?.message}
                  subject={notification?.detail?.subject}
                />
              );
            } else {
              return (
                <AlertNotificationRow
                  notificationSubject={'New notification'}
                  notificationDate={notification?.createdDate}
                  notificationMessage={'You have received a new notification'}
                />
              );
            }
          })}
        </div>
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
