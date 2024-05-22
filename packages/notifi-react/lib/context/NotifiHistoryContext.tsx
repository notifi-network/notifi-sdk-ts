import { Types } from '@notifi-network/notifi-graphql';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';
import { useNotifiTenantConfigContext } from './NotifiTenantConfigContext';

type CursorInfo = Readonly<{
  hasNextPage: boolean;
  endCursor?: string | undefined;
}>;

export type HistoryItem = {
  id: string;
  timestamp: string; // in miniSec
  icon: string;
  customIconUrl: string;
  topic: string;
  subject: string;
  message: string;
  read: boolean;
};

export type NotifiHistoryContextType = {
  isLoading: boolean;
  error: Error | null;
  getHistoryItems: (initialLoad?: boolean) => Promise<void>;
  markAsRead: (ids?: string[]) => Promise<void>;
  historyItems: HistoryItem[];
  unreadCount: number;
  hasNextPage: boolean;
};

const NotifiHistoryContext = createContext<NotifiHistoryContextType>(
  {} as NotifiHistoryContextType,
);

export type NotifiHistoryProviderProps = {
  notificationCountPerPage?: number;
};

export const NotifiHistoryContextProvider: FC<
  PropsWithChildren<NotifiHistoryProviderProps>
> = ({ children, notificationCountPerPage = 20 }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { cardConfig } = useNotifiTenantConfigContext();
  const isInitialLoaded = React.useRef(false);

  useEffect(() => {
    // NOTE: Update historyItems & unreadCount when backend state changed
    if (frontendClientStatus.isAuthenticated) {
      frontendClient.subscribeNotificationHistoryStateChanged((_data) => {
        frontendClient
          .getFusionNotificationHistory({
            first: notificationCountPerPage,
            includeHidden: false,
          })
          .then((res) => {
            const historyItemIdMap = new Map(
              historyItems.map((item) => [item.id, item]),
            );
            const newItems = res?.nodes
              ?.map(parseHistoryItem)
              .filter((item) => !historyItemIdMap.has(item.id));
            if (newItems?.length && newItems.length > 0) {
              setHistoryItems((existing) => [...newItems, ...existing]);
              setUnreadCount((prev) => (prev ? prev + newItems.length : null));
            }
          });
      });
    }
    return () => {
      frontendClient.wsDispose();
    };
  }, [frontendClientStatus, historyItems]);

  const getHistoryItems = React.useCallback(
    async (initialLoad?: boolean) => {
      const cardEventTypeNames = new Set(
        cardConfig?.eventTypes?.map((event) => event.name) ?? [],
      );
      if (cardEventTypeNames.size === 0) {
        return;
      }
      if (!initialLoad && !cursorInfo.hasNextPage) {
        setError(new Error('No more notification history to fetch'));
        return;
      }
      if (isLoading && isInitialLoaded.current) {
        return;
      }
      isInitialLoaded.current = true;
      setIsLoading(true);
      try {
        const result = await frontendClient.getFusionNotificationHistory({
          first: notificationCountPerPage,
          after: cursorInfo.endCursor,
          includeHidden: false,
        });
        if (!result || result.nodes?.length === 0 || !result.nodes) {
          return;
        }
        //NOTE: Filter out the unsupported legacy history items
        const validHistoryItems = result.nodes.filter((node) => {
          if (!node.detail || !validateEventDetails(node.detail)) return false;
          return cardEventTypeNames.has(node.detail.sourceName);
        });

        setHistoryItems((existing) =>
          initialLoad
            ? validHistoryItems.map(parseHistoryItem) ?? []
            : [...existing, ...(validHistoryItems.map(parseHistoryItem) ?? [])],
        );
        setCursorInfo(result.pageInfo);
        setError(null);
      } catch (e) {
        setError(
          new Error(
            'ERROR: Failed to fetch notification history, please try again.',
          ),
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [cardConfig, cursorInfo],
  );

  useEffect(() => {
    // NOTE: Initial load
    if (
      frontendClientStatus.isAuthenticated &&
      !isInitialLoaded.current &&
      cardConfig
    ) {
      getHistoryItems(true);
      frontendClient.getUnreadNotificationHistoryCount().then(({ count }) => {
        setUnreadCount(count);
      });
    }
  }, [frontendClientStatus, getHistoryItems, cardConfig]);

  const markAsRead = async (ids?: string[]) => {
    const isIdsEmpty = ids?.length === 0 || !ids;
    setIsLoading(true);
    switch (isIdsEmpty) {
      case true:
        // Mark all as read
        //  - server side
        try {
          const res = await frontendClient.getFusionNotificationHistory({
            first: 1,
            includeHidden: false,
          });
          if (!res) return;
          ids = res.nodes?.map((node) => node.id) ?? [];
          await frontendClient.markFusionNotificationHistoryAsRead({
            ids: [],
            beforeId: res.nodes?.[0]?.id,
          });
        } catch (e) {
          setError(
            new Error(
              'ERROR: Failed to mark all notification history as read, please try again.',
            ),
          );
          console.error(e);
        } finally {
          setIsLoading(false);
        }

        //  - client side
        setHistoryItems((items) =>
          items.map((item) => ({ ...item, read: true })),
        );
        setUnreadCount(0);
        break;

      case false:
        // Mark selected as read
        //  - server side
        try {
          await frontendClient.markFusionNotificationHistoryAsRead({
            ids: ids!,
          });
          setError(null);
        } catch (e) {
          setError(
            new Error(
              'ERROR: Failed to mark selected notification history as read, please try again.',
            ),
          );
          console.error(e);
        } finally {
          setIsLoading(false);
        }

        //  - client side
        setHistoryItems((items) => {
          const updatedItems = items.map((item) => {
            if (ids!.includes(item.id)) {
              return { ...item, read: true };
            }
            return item;
          });
          return updatedItems;
        });
        setUnreadCount((prev) => (prev ? prev - ids!.length : null));
    }
  };

  return (
    <NotifiHistoryContext.Provider
      value={{
        isLoading,
        error,
        getHistoryItems,
        markAsRead,
        historyItems,
        unreadCount: unreadCount ?? 0,
        hasNextPage: cursorInfo.hasNextPage,
      }}
    >
      {children}
    </NotifiHistoryContext.Provider>
  );
};

export const useNotifiHistoryContext = () =>
  React.useContext(NotifiHistoryContext);

// Utils

const parseHistoryItem = (
  history: Types.FusionNotificationHistoryEntryFragmentFragment,
): HistoryItem => {
  const eventDetails = history.detail;
  if (!eventDetails || eventDetails.__typename !== 'GenericEventDetails') {
    return {
      id: '',
      timestamp: '',
      topic: 'Unsupported Notification Type',
      icon: '',
      customIconUrl: '',
      subject: 'Unsupported Notification Type',
      message:
        'Invalid notification history detail: only support GenericEventDetails',
      read: true,
    };
  }

  return {
    id: history.id,
    timestamp: history.createdDate,
    topic: eventDetails.sourceName,
    subject: eventDetails.notificationTypeName,
    message: eventDetails.genericMessageHtml ?? eventDetails.genericMessage,
    icon: eventDetails.icon,
    customIconUrl: eventDetails.customIconUrl ?? '',
    read: history.read,
  };
};

export type ValidEventDetail = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;
export const validateEventDetails = (details: {
  __typename: string;
}): details is ValidEventDetail => {
  return details.__typename === 'GenericEventDetails';
};
