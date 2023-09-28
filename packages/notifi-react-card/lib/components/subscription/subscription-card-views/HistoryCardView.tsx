import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';

import { NotificationEmptyBellIcon } from '../../../assets/NotificationEmptyBellIcon';
import { useNotifiClientContext } from '../../../context';
import {
  DeepPartialReadonly,
  concatHistoryNodes,
  getAlertNotificationViewBaseProps,
  validateIsSupported,
} from '../../../utils';
import { MESSAGES_PER_PAGE } from '../../../utils/constants';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from '../../AlertHistory/AlertNotificationRow';

export type NotificationHistoryEntry =
  | Types.FusionNotificationHistoryEntryFragmentFragment
  | Types.NotificationHistoryEntryFragmentFragment;

export type AlertHistoryViewProps = Readonly<{
  noAlertDescription?: string;
  isHidden: boolean;
  data: CardConfigItemV1;
  classNames?: DeepPartialReadonly<{
    title: string;
    header: string;
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
    React.SetStateAction<NotificationHistoryEntry | undefined>
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
  const [hasNextPage, setHasNextPage] = useState<boolean>();
  const isQuerying = useRef<boolean>(false);
  const fetched = useRef<boolean>(false);

  const { client, isUsingFrontendClient, frontendClient } =
    useNotifiClientContext();

  const [allNodes, setAllNodes] = useState<NotificationHistoryEntry[]>([]);
  const { isClientInitialized, isClientAuthenticated } = useMemo(() => {
    return {
      isClientInitialized: isUsingFrontendClient
        ? !!frontendClient.userState
        : client.isInitialized,
      isClientAuthenticated: isUsingFrontendClient
        ? frontendClient.userState?.status === 'authenticated'
        : client.isAuthenticated,
    };
  }, [isUsingFrontendClient, client, frontendClient]);

  const getNotificationHistory = useCallback(
    async ({ first, after }: Types.GetNotificationHistoryQueryVariables) => {
      if (isQuerying.current) {
        return;
      }
      isQuerying.current = true;

      const result = isUsingFrontendClient
        ? await frontendClient.getFusionNotificationHistory({
            first,
            after,
            includeHidden: false,
          })
        : await client.getNotificationHistory({
            first,
            after,
          });

      const nodes: NotificationHistoryEntry[] = result?.nodes ?? [];
      setAllNodes((existing) => concatHistoryNodes(existing, nodes));

      setEndCursor(result?.pageInfo.endCursor);
      setHasNextPage(result?.pageInfo.hasNextPage);

      isQuerying.current = false;
      return result;
    },
    [
      client,
      frontendClient,
      isUsingFrontendClient,
      setAllNodes,
      setEndCursor,
      setHasNextPage,
    ],
  );

  useEffect(() => {
    if (!isClientInitialized || !isClientAuthenticated) {
      return;
    }

    if (!fetched.current) {
      fetched.current = true;
      getNotificationHistory({
        first: MESSAGES_PER_PAGE,
      });
    }
  }, [client, frontendClient, isUsingFrontendClient]);

  useEffect(() => {
    if (isUsingFrontendClient && allNodes.length > 0) {
      frontendClient
        .markFusionNotificationHistoryAsRead({
          ids: [],
          beforeId: allNodes[0].id,
        })
        .catch((e) => console.log('Failed to mark as read', e));
    }
  }, [allNodes]);

  return (
    <div
      className={clsx(
        'NotifiAlertHistory__container',
        classNames?.historyContainer,
        { 'NotifiAlertHistory__container--hidden': isHidden },
      )}
    >
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
