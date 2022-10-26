import {
  GetNotificationHistoryInput,
  GetNotificationHistoryResult,
  NotificationHistoryEntry,
} from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRange, Virtuoso } from 'react-virtuoso';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../context';
import { MESSAGES_PER_PAGE } from '../../../utils/constants';
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

  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>();
  const [visibleRange, setVisibleRange] = useState<ListRange>();
  const [isScrolling, setIsScrolling] = useState<boolean | null>();
  const [allNodes, setAllNodes] = useState<
    ReadonlyArray<NotificationHistoryEntry>
  >([]);

  const [alertHistoryData, setAlertHistoryData] =
    useState<GetNotificationHistoryResult>();

  const { client } = useNotifiClientContext();

  async function getNotificationHistory({
    first,
    after,
  }: GetNotificationHistoryInput) {
    const notificationHistory = await client
      .getNotificationHistory({
        first,
        after,
      })
      .then((result) => {
        setAlertHistoryData(result);
        if (result.nodes) setAllNodes(allNodes.concat(result.nodes));
        setEndCursor(result.pageInfo.endCursor);
        setHasNextPage(result.pageInfo.hasNextPage);
      });
    return notificationHistory;
  }

  useEffect(() => {
    if (!alertHistoryData) {
      getNotificationHistory({
        first: MESSAGES_PER_PAGE,
      });
    }

    const isRequestNextPage =
      currentIndex &&
      visibleRange &&
      currentIndex === visibleRange?.endIndex &&
      currentIndex > 0 &&
      hasNextPage &&
      endCursor &&
      isScrolling;

    if (isRequestNextPage) {
      getNotificationHistory({
        first: MESSAGES_PER_PAGE,
        after: endCursor,
      });
    }
  }, [currentIndex, visibleRange, hasNextPage, endCursor]);

  const returnVirtualizedContainer = useCallback(() => {
    if (!allNodes) return;
    return (
      <Virtuoso
        style={{
          height: notificationListHeight || '400px',
          marginBottom: '25px',
        }}
        isScrolling={setIsScrolling}
        rangeChanged={setVisibleRange}
        data={allNodes.filter(
          (notification) => notification.detail != undefined,
        )}
        itemContent={(index, notification) => {
          setCurrentIndex(index);
          return (
            <AlertCard key={notification.id} notification={notification} />
          );
        }}
      />
    );
  }, [alertHistoryData]);

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
        returnVirtualizedContainer()
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
