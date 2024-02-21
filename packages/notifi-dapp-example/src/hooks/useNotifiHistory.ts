import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useCallback } from 'react';

export const useNotifiHistory = () => {
  const { frontendClient } = useNotifiClientContext();

  const markNotifiHistoryAsRead = useCallback(
    async (ids?: string[]) => {
      if (!frontendClient) return;

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
      frontendClient.markFusionNotificationHistoryAsRead({
        ids,
      });
    },
    [frontendClient],
  );

  return { markNotifiHistoryAsRead };
};
