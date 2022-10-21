import { GetNotificationHistoryResult } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import { getAlertCard } from 'notifi-react-card/lib/utils/AlertHistoryUtils';
import React, { useCallback, useState } from 'react';

import { ReactComponent as BackArrow } from '../../../assets/backArrow.svg';
import { useNotifiSubscriptionContext } from '../../../context';
import { useAlertHistory } from '../../../hooks/useAlertHistory';

export type AlertHistoryViewProps = Readonly<{
  alertHistoryTitle?: string;
  noAlertDescription?: string;
  classNames?: Readonly<{
    title?: string;
    header?: string;
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
      <div className={clsx('NotifiAlertHistory__header', classNames?.header)}>
        <BackArrow onClick={() => handleBackClick()} />
        <span className={clsx('NotifiAlertHistory__label', classNames?.title)}>
          {alertHistoryTitle}
        </span>
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
            return getAlertCard(notification);
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
