import {
  GetNotificationHistoryInput,
  NotificationHistoryEntry,
} from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { NotificationEmptyBellIcon } from '../../../assets/NotificationEmptyBellIcon';
import { useNotifiClientContext } from '../../../context';
import { DeepPartialReadonly } from '../../../utils';
import { MESSAGES_PER_PAGE } from '../../../utils/constants';
import {
  AlertDetailsCard,
  AlertDetailsProps,
} from '../../AlertHistory/AlertDetailsCard';
import { AlertNotificationViewProps } from '../../AlertHistory/AlertNotificationRow';
import { BroadcastMessageChangedRenderer } from '../../AlertHistory/BroadcastMessageChangedRenderer';
import { ChatMessageReceivedRenderer } from '../../AlertHistory/ChatMessageReceivedRenderer';
import { GenericDetailRenderer } from '../../AlertHistory/GenericDetailRenderer';
import { HealthValueOverThresholdEventRenderer } from '../../AlertHistory/HealthValueOverThresholdEventRenderer';

export type AlertHistoryViewProps = Readonly<{
  noAlertDescription?: string;
  classNames?: DeepPartialReadonly<{
    title: string;
    header: string;
    dividerLine: string;
    manageAlertLink: string;
    noAlertDescription: string;
    notificationDate: string;
    notificationSubject: string;
    notificationMessage: string;
    notificationImage: string;
    notificationList: string;
    emptyAlertsBellIcon: string;
    virtuoso: string;
    AlertDetailsCard: AlertDetailsProps['classNames'];
    AlertCard: AlertNotificationViewProps['classNames'];
  }>;
}>;

export const AlertCard: React.FC<{
  notification: NotificationHistoryEntry;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}> = ({
  notification,
  handleAlertEntrySelection,
  classNames,
}: Readonly<{
  notification: NotificationHistoryEntry;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>) => {
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
          classNames={classNames}
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
          classNames={classNames}
        />
      );
    case 'GenericEventDetails':
      return (
        <GenericDetailRenderer
          handleAlertEntrySelection={handleAlertEntrySelection}
          notificationTitle={detail.sourceName}
          createdDate={notification.createdDate}
          subject={detail.notificationTypeName}
          message={detail.genericMessage}
          icon={detail.icon}
          classNames={classNames}
        />
      );
    case 'ChatMessageReceivedEventDetails':
      return (
        <ChatMessageReceivedRenderer
          handleAlertEntrySelection={handleAlertEntrySelection}
          senderName={detail.senderName}
          messageBody={detail.messageBody}
          createdDate={notification.createdDate}
          classNames={classNames}
        />
      );
  }
  return null;
};

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({
  classNames,
  noAlertDescription,
}) => {
  noAlertDescription = noAlertDescription
    ? noAlertDescription
    : 'You haven’t received any notifications yet';

  const [selectedAlertEntry, setAlertEntry] = useState<
    NotificationHistoryEntry | undefined
  >(undefined);

  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const isQuerying = useRef<boolean>(false);
  const fetched = useRef<boolean>(false);

  const [allNodes, setAllNodes] = useState<
    ReadonlyArray<NotificationHistoryEntry>
  >([]);

  const { client } = useNotifiClientContext();

  const getNotificationHistory = useCallback(
    async ({ first, after }: GetNotificationHistoryInput) => {
      if (isQuerying.current) {
        return;
      }
      isQuerying.current = true;
      const result = await client.getNotificationHistory({
        first,
        after,
      });

      const nodes = result.nodes ?? [];
      setAllNodes((existing) => existing.concat(nodes));

      setEndCursor(result.pageInfo.endCursor);
      setHasNextPage(result.pageInfo.hasNextPage);

      isQuerying.current = false;
      return result;
    },
    [client, setAllNodes, setEndCursor, setHasNextPage],
  );

  useEffect(() => {
    if (!client.isInitialized || !client.isAuthenticated) {
      return;
    }

    if (!fetched.current) {
      fetched.current = true;
      getNotificationHistory({
        first: MESSAGES_PER_PAGE,
      });
    }
  }, [client]);

  return (
    <>
      <div
        className={clsx(
          'NotifiAlertHistory__dividerLine',
          classNames?.dividerLine,
        )}
      />
      {selectedAlertEntry !== undefined ? (
        <AlertDetailsCard
          classNames={classNames?.AlertDetailsCard}
          notificationEntry={selectedAlertEntry}
          handleClose={() => setAlertEntry(undefined)}
        />
      ) : null}
      {allNodes.length > 0 ? (
        <Virtuoso
          className={clsx('NotifiAlertHistory__virtuoso', classNames?.virtuoso)}
          style={{ flex: 1 }}
          endReached={() => {
            if (hasNextPage && endCursor) {
              getNotificationHistory({
                first: MESSAGES_PER_PAGE,
                after: endCursor,
              });
            }
          }}
          data={allNodes.filter(
            (notification) => notification.detail != undefined,
          )}
          itemContent={(_index, notification) => {
            return (
              <AlertCard
                classNames={classNames?.AlertCard}
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
