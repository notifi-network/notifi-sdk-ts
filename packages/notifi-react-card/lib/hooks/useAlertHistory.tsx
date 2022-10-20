import { useCallback } from 'react';

import { useNotifiClientContext } from '../context';

type NotifiAlertHistoryProps = {
  first?: number | undefined;
  after?: string | undefined;
};

export const useAlertHistory = ({ first, after }: NotifiAlertHistoryProps) => {
  const { client } = useNotifiClientContext();

  const input = {
    first: first,
    after: after,
  };

  const getNotifiAlertHistory = useCallback(async () => {
    const response = await client.getNotificationHistory(input);
    return response;
  }, []);

  return {
    getNotifiAlertHistory,
  };
};
