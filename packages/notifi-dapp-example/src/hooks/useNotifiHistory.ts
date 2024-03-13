import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { validateEventDetails } from '@/utils/notifiHistoryUtils';
import { Types } from '@notifi-network/notifi-graphql';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useCallback, useEffect, useRef, useState } from 'react';

type CursorInfo = Readonly<{
  hasNextPage: boolean;
  endCursor?: string | undefined;
}>;

const messagePerPage = 50;

/**
 * @param autoFetchHistoryAndUnreadCount - If true, fetches the notification history & unread count on mount
 */
export const useNotifiHistory = (autoFetchHistoryAndUnreadCount?: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { popGlobalInfoModal } = useGlobalStateContext();
  const { frontendClient } = useNotifiClientContext();
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [nodes, setNodes] = useState<
    Types.FusionNotificationHistoryEntryFragmentFragment[]
  >([]);
  const { cardConfig } = useNotifiTenantConfig();
  const historyLoaded = useRef<boolean>(false);

  const cardEventTypeNames = new Set(
    cardConfig?.eventTypes?.map((event) => event.name) ?? [],
  );

  const markNotifiHistoryAsRead = useCallback(
    async (ids?: string[]) => {
      if (!frontendClient) return;
      // TODO: implement loading state
      if (ids?.length === 0 || !ids) {
        // Mark all as read
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
        return;
      }

      // Mark selected as read
      await frontendClient.markFusionNotificationHistoryAsRead({
        ids,
      });
    },
    [frontendClient],
  );

  const getNotificationHistory = (initialLoad?: boolean) => {
    if (!initialLoad && !cursorInfo.hasNextPage) {
      popGlobalInfoModal({
        message: 'No more notification history to fetch',
        iconOrEmoji: { type: 'icon', id: 'warning' },
        timeout: 5000,
      });
      return;
    }
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    frontendClient
      .getFusionNotificationHistory({
        first: messagePerPage,
        after: cursorInfo.endCursor,
        includeHidden: false,
      })
      .then((result) => {
        if (!result || result.nodes?.length === 0 || !result.nodes) {
          return;
        }
        // Filter out events that are not supported by the card
        result.nodes.filter((node) => {
          if (!node.detail || !validateEventDetails(node.detail)) return false;
          return cardEventTypeNames.has(node.detail.sourceName);
        });

        setNodes((existing) =>
          initialLoad
            ? result.nodes ?? []
            : [...existing, ...(result.nodes ?? [])],
        );
        setCursorInfo(result.pageInfo);
        historyLoaded.current = true;
      })
      .catch((e) => {
        popGlobalInfoModal({
          message:
            'ERROR: Failed to fetch notification history, check console for more details',
          iconOrEmoji: { type: 'icon', id: 'warning' },
          timeout: 5000,
        });
        console.error('Failed to fetch notification history', e);
      })
      .finally(() => setIsLoading(false));
  };

  if (autoFetchHistoryAndUnreadCount) {
    useEffect(() => {
      getNotificationHistory(true);
      frontendClient.getUnreadNotificationHistoryCount().then(({ count }) => {
        setUnreadCount(count);
      });
    }, [frontendClient]);
  }

  return {
    markNotifiHistoryAsRead,
    isLoading,
    nodes,
    getNotificationHistory,
    unreadCount,
    cursorInfo,
    setUnreadCount,
  };
};
