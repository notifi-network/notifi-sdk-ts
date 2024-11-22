import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { getFusionEventMetadata } from '../utils';
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
  topic: string;
  subject: string;
  message: string;
  read: boolean;
  customIconUrl: string;
  fusionEventId: string;
};

export type NotifiHistoryContextType = {
  isLoading: boolean;
  error: Error | null;
  getHistoryItems: (initialLoad?: boolean) => Promise<void>;
  markAsRead: (ids?: string[]) => Promise<void>;
  historyItems: HistoryItem[];
  unreadCount: number;
  hasNextPage: boolean;
  isIncludeRead: boolean;
  setIsIncludeRead: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotifiHistoryContext = createContext<NotifiHistoryContextType>(
  {} as NotifiHistoryContextType,
);

export type NotifiHistoryProviderProps = {
  notificationCountPerPage?: number;
  // NOTE: 'tenant' - fetch tenant unread count, 'card' - fetch card unread count (default)
  unreadCountScope?: 'tenant' | 'card';
};

export const NotifiHistoryContextProvider: FC<
  PropsWithChildren<NotifiHistoryProviderProps>
> = ({
  children,
  notificationCountPerPage = 20,
  unreadCountScope = 'card',
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [isIncludeRead, setIsIncludeRead] = useState<boolean>(true);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { cardConfig, fusionEventTopics } = useNotifiTenantConfigContext();
  const isInitialLoaded = React.useRef(false);

  const currentSubscription =
    React.useRef<ReturnType<NotifiFrontendClient['addEventListener']>>();

  useEffect(() => {
    // NOTE: Update historyItems & unreadCount when backend state changed
    if (frontendClientStatus.isAuthenticated) {
      const fusionEventIds = new Set(
        fusionEventTopics.map((topic) => topic.fusionEventDescriptor.id ?? ''),
      );
      const historyUpdateHandler = (evt: Types.StateChangedEvent) => {
        if (evt.__typename !== 'NotificationHistoryStateChangedEvent') return;

        frontendClient
          .getFusionNotificationHistory({
            first: notificationCountPerPage,
            includeHidden: false,
            includeRead: isIncludeRead,
          })
          .then((res) => {
            const existingItemIds = new Set(
              historyItems.map((item) => item.id),
            );

            const newItems = res?.nodes
              ?.map(parseHistoryItem)
              .filter(
                (item) =>
                  !existingItemIds.has(item.id) &&
                  fusionEventIds.has(item.fusionEventId),
              );

            if (newItems?.length && newItems.length > 0) {
              setHistoryItems((existing) => [...newItems, ...existing]);
              setUnreadCount((prev) =>
                prev !== null ? prev + newItems.length : null,
              );
            }
          });
      };

      currentSubscription.current = frontendClient.addEventListener(
        'stateChanged',
        historyUpdateHandler,
        (error) => {
          if (error instanceof Error) {
            setError({
              ...error,
              message: `NotifiHistoryContext - stateChanged: ${error.message}`,
            });
          }
          console.error('NotifiHistoryContext - stateChanged:', error);
        },
      );

      return () => {
        const id = currentSubscription.current;
        if (!id) return;
        frontendClient.removeEventListener('stateChanged', id);
        currentSubscription.current = undefined;
        setError(null);
      };
    }
  }, [frontendClientStatus, historyItems]);

  const getHistoryItems = React.useCallback(
    async (initialLoad?: boolean) => {
      if (!frontendClientStatus.isAuthenticated) return;
      const cardEventTypeNames = new Set(
        cardConfig?.eventTypes?.map((event) => event.name) ?? [],
      );
      // TODO: Use FusionEventId to filter the history items (Blocker: MVP-5101)
      // const cardEventFusionIds = new Set(
      //   cardConfig?.eventTypes?.map((event) =>
      //     event.type === 'fusion'
      //       ? resolveStringRef(
      //           `getHistoryItem - resolve ${event.name}`,
      //           event.fusionEventId,
      //           {},
      //         )
      //       : '',
      //   ) ?? [],
      // );
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
          after: initialLoad ? undefined : cursorInfo.endCursor,
          includeHidden: false,
          includeRead: isIncludeRead,
        });
        if (!result || result.nodes?.length === 0 || !result.nodes) {
          return;
        }
        //NOTE: Filter out the unsupported legacy history items
        const validHistoryItems = result.nodes.filter((node) => {
          if (!node.detail || !validateEventDetails(node.detail)) return false;
          return cardEventTypeNames.has(node.detail.sourceName);
          // TODO: Use FusionEventId to filter the history items (Blocker: MVP-5101)
          // ||
          // cardEventFusionIds.has(node.detail.fusionEventId)
        });

        setHistoryItems((existing) =>
          initialLoad
            ? (validHistoryItems.map(parseHistoryItem) ?? [])
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
    [cardConfig, cursorInfo, frontendClientStatus, isIncludeRead],
  );

  useEffect(() => {
    // NOTE: Initial load
    if (
      frontendClientStatus.isAuthenticated &&
      !isInitialLoaded.current &&
      cardConfig
    ) {
      getHistoryItems(true);

      let getUnreadCountInput: string | undefined = undefined;
      switch (unreadCountScope) {
        case 'card':
          if (!cardConfig.id)
            return setError(
              new Error(
                'Card ID is missing, fetch tenant unread count instead.',
              ),
            );
          getUnreadCountInput = cardConfig.id;
          break;
        default: // tenant, intentionally left blank
      }
      frontendClient
        .getUnreadNotificationHistoryCount(getUnreadCountInput)
        .then(({ count }) => {
          setUnreadCount(count);
        });
    }
  }, [frontendClientStatus, getHistoryItems, cardConfig]);

  useEffect(() => {
    // NOTE: refresh history while switch between the following modes: only showing unread (`isIncludeRead=false`) & showing all histories (`isIncludeRead=ture`)
    if (frontendClientStatus.isAuthenticated) {
      setHistoryItems([]);
      getHistoryItems(true);
    }
  }, [isIncludeRead]);

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

  const parseHistoryItem = React.useCallback(
    (
      history: Types.FusionNotificationHistoryEntryFragmentFragment,
    ): HistoryItem => {
      const eventDetails = history.detail;
      const fusionEventVariables = history.fusionEventVariables;
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
          fusionEventId: '',
        };
      }

      const fusionEventTopic = fusionEventTopics.find(
        (fusionEventTopic) =>
          // TODO: Use FusionEventId to find the topic (Blocker: MVP-5101)
          // fusionEventTopic.uiConfig.fusionEventId ===
          //   eventDetails.fusionEventId ||
          fusionEventTopic.uiConfig.name === eventDetails.sourceName,
      );
      const fusionEventMetadata = fusionEventTopic
        ? getFusionEventMetadata(fusionEventTopic)
        : null;

      const historyTopic =
        fusionEventMetadata?.uiConfigOverride?.historyDisplayName || // display topic name if it has a custom display name
        fusionEventTopic?.uiConfig.topicGroupName || // display topic group name if it belongs to a certain topic group
        fusionEventTopic?.fusionEventDescriptor.name || // display topic name if it has no custom display name
        eventDetails.sourceName; // backward compatibility for legacy alerts

      return {
        id: history.id,
        timestamp: history.createdDate,
        topic: historyTopic,
        subject: eventDetails.notificationTypeName,
        message: eventDetails.genericMessageHtml ?? eventDetails.genericMessage,
        icon: eventDetails.icon,
        customIconUrl: eventDetails.customIconUrl ?? '',
        read: history.read,
        fusionEventId:
          parseHistoryFusionVariablesJson(fusionEventVariables)?.NotifiData
            .EventTypeId ?? '',
      };
    },
    [fusionEventTopics],
  );

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
        isIncludeRead,
        setIsIncludeRead,
      }}
    >
      {children}
    </NotifiHistoryContext.Provider>
  );
};

export const useNotifiHistoryContext = () =>
  React.useContext(NotifiHistoryContext);

// Utils

export type ValidEventDetail = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;
export const validateEventDetails = (details: {
  __typename: string;
}): details is ValidEventDetail => {
  return details.__typename === 'GenericEventDetails';
};

// TODO: update the type for EventData and AlertData
type HistoryFusionEventVariables<T extends object = object> = {
  EventData: unknown;
  AlertData: unknown;
  NotifiData: {
    TenantId: string;
    TenantName: string;
    ChangeSignature: string;
    SourceTypeId: string;
    AlertId: string;
    ComparisonValue: string;
    EventTypeId: string;
    TopicHistoryDisplayName: string;
    Blockchain: string;
    PixelUrl: string;
  };
  unsubscribe_url: string;
};

const parseHistoryFusionVariablesJson = (
  variablesJson: string,
): HistoryFusionEventVariables | null => {
  try {
    const variables = JSON.parse(variablesJson);
    if (
      typeof variables === 'object' &&
      variables.NotifiData &&
      'EventTypeId' in variables.NotifiData
    ) {
      return variables as HistoryFusionEventVariables;
    }
    return null;
  } catch (e) {
    console.warn(
      'NotifiHistoryContext: Found invalid fusionVariablesJson: ',
      variablesJson,
    );
    return null;
  }
};
