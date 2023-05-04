import { GetNotificationHistoryInput } from '@notifi-network/notifi-core';
import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { NotificationEmptyBellIcon } from '../../../assets/NotificationEmptyBellIcon';
import { useNotifiClientContext } from '../../../context';
import {
  DeepPartialReadonly,
  getAlertNotificationViewBaseProps,
  validateIsSupported,
} from '../../../utils';
import { MESSAGES_PER_PAGE } from '../../../utils/constants';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from '../../AlertHistory/AlertNotificationRow';

export type AlertHistoryViewProps = Readonly<{
  noAlertDescription?: string;
  isHidden: boolean;
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
    historyContainer: string;
    virtuoso: string;
    AlertCard: AlertNotificationViewProps['classNames'];
  }>;
  setAlertEntry: React.Dispatch<
    React.SetStateAction<
      Types.NotificationHistoryEntryFragmentFragment | undefined
    >
  >;
}>;

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({
  classNames,
  isHidden,
  noAlertDescription,
  setAlertEntry,
}) => {
  noAlertDescription = noAlertDescription
    ? noAlertDescription
    : 'You haven’t received any notifications yet';

  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const isQuerying = useRef<boolean>(false);
  const fetched = useRef<boolean>(false);

  const [allNodes, setAllNodes] = useState<
    ReadonlyArray<Types.NotificationHistoryEntryFragmentFragment>
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
    <div
      className={clsx(
        'NotifiAlertHistory__container',
        classNames?.historyContainer,
        { 'NotifiAlertHistory__container--hidden': isHidden },
      )}
    >
      <div
        className={clsx(
          'NotifiAlertHistory__dividerLine',
          classNames?.dividerLine,
        )}
      />
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
          data={allNodes.filter(validateIsSupported)}
          itemContent={(_index, notification) => {
            return (
              <AlertNotificationRow
                {...getAlertNotificationViewBaseProps(notification)}
                handleAlertEntrySelection={() => setAlertEntry(notification)}
                classNames={classNames?.AlertCard}
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
    </div>
  );
};
