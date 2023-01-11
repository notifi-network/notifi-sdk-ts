import {
  GetNotificationHistoryInput,
  GetNotificationHistoryResult,
  NotificationHistoryEntry,
} from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { ListRange, Virtuoso } from 'react-virtuoso';

import { NotificationEmptyBellIcon } from '../../../assets/NotificationEmptyBellIcon';
import { Settings } from '../../../assets/Settings';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../context';
import { MESSAGES_PER_PAGE } from '../../../utils/constants';
import { AlertDetailsCard } from '../../AlertHistory/AlertDetailsCard';
import { BroadcastMessageChangedRenderer } from '../../AlertHistory/BroadcastMessageChangedRenderer';
import { HealthValueOverThresholdEventRenderer } from '../../AlertHistory/HealthValueOverThresholdEventRenderer';

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
    emptyAlertsBellIcon?: string;
  }>;
}>;

export const AlertCard = ({
  notification,
  handleAlertEntrySelection,
}: Readonly<{
  notification: NotificationHistoryEntry;
  handleAlertEntrySelection: () => void;
  healthCheckIcon?: JSX.Element;
  broadcastIcon?: JSX.Element;
}>): React.ReactElement => {
  const detail = notification.detail;

  switch (detail?.__typename) {
    case 'BroadcastMessageEventDetails':
      return (
        <BroadcastMessageChangedRenderer
          handleAlertEntrySelection={handleAlertEntrySelection}
          notificationTitle={'Announcement'}
          createdDate={notification.createdDate}
          message={detail.message ?? ''}
          subject={detail.subject ?? ''}
        />
      );
    case 'HealthValueOverThresholdEventDetails':
      return (
        <HealthValueOverThresholdEventRenderer
          handleAlertEntrySelection={handleAlertEntrySelection}
          notificationTitle={'Health Check'}
          createdDate={notification.createdDate}
          threshold={detail.threshold ?? ''}
          name={detail.name ?? ''}
          value={detail.value ?? ''}
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
    : 'You haven’t received any notifications yet';

  const { setCardView } = useNotifiSubscriptionContext();

  const handleBackClick = () => {
    setCardView({ state: 'preview' });
  };

  const [selectedAlertEntry, setAlertEntry] = useState<
    NotificationHistoryEntry | undefined
  >(undefined);

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

  return (
    <>
      <div className={clsx('NotifiAlertHistory__header', classNames?.header)}>
        <span className={clsx('NotifiAlertHistory__label', classNames?.title)}>
          {alertHistoryTitle}
        </span>

        <Settings
          onClick={handleBackClick}
          className={clsx(
            'NotifiAlertHistory__settingsIcon',
            classNames?.manageAlertLink,
          )}
        />
      </div>
      <div
        className={clsx(
          'NotifiAlertHistory__dividerLine',
          classNames?.dividerLine,
        )}
      />
      {selectedAlertEntry !== undefined ? (
        <AlertDetailsCard
          notificationEntry={selectedAlertEntry}
          handleClose={() => setAlertEntry(undefined)}
        />
      ) : null}
      {alertHistoryData?.nodes && alertHistoryData.nodes.length > 0 ? (
        <Virtuoso
          style={{
            height: notificationListHeight || '400px',
            marginBottom: '25px',
            overflowX: 'hidden',
          }}
          isScrolling={setIsScrolling}
          rangeChanged={setVisibleRange}
          data={allNodes.filter(
            (notification) => notification.detail != undefined,
          )}
          itemContent={(index, notification) => {
            setCurrentIndex(index);
            return (
              <AlertCard
                handleAlertEntrySelection={() => setAlertEntry(notification)}
                key={notification.id}
                notification={notification}
              />
            );
          }}
        />
      ) : (
        <div className="NotifiAlertHistory__noAlertContainer">
          <NotificationEmptyBellIcon
            className={clsx(
              'NotifiAlertHistory__emptyAlertsBellIcon',
              classNames?.emptyAlertsBellIcon,
            )}
          />
          <span
            className={clsx(
              'NotifiAlertHistory_noAlertDescription',
              classNames?.noAlertDescription,
            )}
          >
            {noAlertDescription}
          </span>
        </div>
      )}
    </>
  );
};
