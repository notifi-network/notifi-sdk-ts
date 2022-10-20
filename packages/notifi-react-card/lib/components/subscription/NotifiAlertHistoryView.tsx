import { GetNotificationHistoryResult } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

import { AlertNotificationRow } from '../../AlertHistory/AlertNotificationRow';
import { useAlertHistory } from '../../hooks/useAlertHistory';

export type AlertHistoryViewProps = Readonly<{
  alertHistoryTitle?: string;
  noAlertDescription?: string;
  classNames?: Readonly<{
    title?: string;
    dividerLine?: string;
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
      <span className={clsx('NotifiAlertHistory__label', classNames?.title)}>
        {alertHistoryTitle}
      </span>
      <div
        className={clsx(
          'NotifiAlertHistory__dividerLine',
          classNames?.dividerLine,
        )}
      ></div>
      {alertHistoryData ? (
        <div>
          {alertHistoryData?.nodes?.map((notification) => {
            return (
              <AlertNotificationRow
                notificationSubject={''}
                notificationDate={''}
                notificationMessage={''}
                classNames={{
                  notificationDate: classNames?.notificationDate,
                  notificationSubject: classNames?.notificationSubject,
                  notificationMessage: classNames?.notificationMessage,
                  notificationImage: classNames?.notificationImage,
                }}
              ></AlertNotificationRow>
            );
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
