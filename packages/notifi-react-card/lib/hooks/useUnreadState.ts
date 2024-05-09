import { useEffect, useMemo, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../context';

export const useUnreadState = () => {
  const { frontendClient, isUsingFrontendClient } = useNotifiClientContext();

  if (!isUsingFrontendClient)
    throw new Error(
      'Number badge is only available when frontendClient is enabled',
    );

  const { params: { walletPublicKey },
  } = useNotifiSubscriptionContext();

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isStateChangedSubscribed, setIsStateChangedSubscribed] = useState(false);
  const hasUnreadNotification = useMemo(
    () => (unreadNotificationCount > 0 ? true : false),
    [unreadNotificationCount],
  );

  const clearNotificationCount = () => {
    setUnreadNotificationCount(0);
  };
  const { isClientAuthenticated } = useMemo(() => {
    return {
      isClientAuthenticated:
        frontendClient.userState?.status === 'authenticated',
    };
  }, [frontendClient.userState?.status]);

  useEffect(() => {
    if (!walletPublicKey || !isClientAuthenticated || isStateChangedSubscribed) return;

    setIsStateChangedSubscribed(true);
    frontendClient.subscribeNotificationHistoryStateChanged((data) => {
      frontendClient.getUnreadNotificationHistoryCount().then((res) => {
        const unreadNotificationCount = res.count;
        setUnreadNotificationCount(unreadNotificationCount);
      });
    });

    return () => { frontendClient.wsDispose(); }

  }, [isClientAuthenticated, walletPublicKey, isUsingFrontendClient]);

  return { hasUnreadNotification, unreadNotificationCount, clearNotificationCount };
};
