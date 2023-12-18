import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import { useDestinationState } from 'notifi-react-card/lib/hooks/useDestinationState';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';

import { NotificationEmptyBellIcon } from '../../../assets/NotificationEmptyBellIcon';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../context';
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
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../../NotifiAlertBox';
import { SignupBanner, SignupBannerProps } from '../../SignupBanner';
import { VerifyBanner, VerifyBannerProps } from '../../VerifyBanner';
import { LoadingStateCardProps } from '../../common';
import Spinner from '../../common/Spinner';

export type NotificationHistoryEntry =
  | Types.FusionNotificationHistoryEntryFragmentFragment
  | Types.NotificationHistoryEntryFragmentFragment;

export type AlertHistoryViewProps = Readonly<{
  noAlertDescription?: string;
  data: CardConfigItemV1;
  copy?: {
    /**
     * @deprecated No longer have loading header when loading history
     */
    loadingHeader?: string;
    /**
     * @deprecated No longer have loading content when loading history
     */
    loadingContent?: string;
    loadingSpinnerSize?: string;
    loadingRingColor?: string;
  };
  classNames?: DeepPartialReadonly<{
    title?: string;
    header?: string;
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    dividerLine?: string;
    manageAlertLink?: string;
    noAlertDescription?: string;
    notificationDate?: string;
    notificationSubject?: string;
    notificationMessage?: string;
    notificationImage?: string;
    notificationList?: string;
    emptyAlertsBellIcon?: string;
    historyContainer?: string;
    virtuoso?: string;
    AlertCard?: AlertNotificationViewProps['classNames'];
    /**
     * @deprecated Use `loadingSpinner` instead
     */
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    loadingSpinner?: string;
    verifyBanner?: VerifyBannerProps['classNames'];
    signupBanner?: SignupBannerProps['classNames'];
    alertContainer?: string;
  }>;
  setAlertEntry: React.Dispatch<
    React.SetStateAction<NotificationHistoryEntry | undefined>
  >;
  headerRightIcon?: NotifiAlertBoxButtonProps;
}>;

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({
  classNames,
  noAlertDescription,
  setAlertEntry,
  copy,
  data,
  headerRightIcon,
}) => {
  noAlertDescription = noAlertDescription
    ? noAlertDescription
    : 'You haven’t received any notifications yet';

  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetched = useRef<boolean>(false);

  const { client, isUsingFrontendClient, frontendClient } =
    useNotifiClientContext();

  const { setCardView } = useNotifiSubscriptionContext();

  const { unverifiedDestinations, isTargetsExist } = useDestinationState();

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
      if (isLoading) {
        return;
      }
      setIsLoading(true);

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

      setIsLoading(false);
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
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        leftIcon={{
          name: 'settings',
          onClick: () => setCardView({ state: 'preview' }),
        }}
        rightIcon={headerRightIcon}
      >
        <h2>
          {(data?.titles?.active && data?.titles.historyView) ||
            'Alert History'}
        </h2>
      </NotifiAlertBox>

      <div
        className={clsx(
          'NotifiSubscriptionCardV1__alertContainer',
          classNames?.alertContainer,
        )}
      >
        <div className={clsx('DividerLine history', classNames?.dividerLine)} />

        {unverifiedDestinations.length > 0 ? (
          <VerifyBanner
            classNames={classNames?.verifyBanner}
            unVerifiedDestinations={unverifiedDestinations}
          />
        ) : null}
        {!isTargetsExist ? (
          <SignupBanner data={data} classNames={classNames?.signupBanner} />
        ) : null}

        <div
          className={clsx(
            'NotifiAlertHistory__container',
            classNames?.historyContainer,
          )}
        >
          {allNodes.length > 0 && !isLoading ? (
            <Virtuoso
              className={clsx(
                'NotifiAlertHistory__virtuoso',
                classNames?.virtuoso,
              )}
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
                    handleAlertEntrySelection={() => {
                      setAlertEntry(notification);
                      setCardView({ state: 'historyDetail' });
                    }}
                    classNames={classNames?.AlertCard}
                  />
                );
              }}
            />
          ) : null}

          {allNodes.length === 0 && !isLoading ? (
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
          ) : null}

          {isLoading ? (
            <div
              className={clsx(
                'NotifiAlertHistory__loading',
                classNames?.loadingSpinner,
              )}
            >
              <Spinner
                size={copy?.loadingSpinnerSize}
                ringColor={copy?.loadingRingColor}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
