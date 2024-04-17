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

  const {
    params: { walletPublicKey },
  } = useNotifiSubscriptionContext();

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const hasUnreadNotification = useMemo(
    () => (unreadNotificationCount > 0 ? true : false),
    [unreadNotificationCount],
  );
  const { isClientAuthenticated } = useMemo(() => {
    return {
      isClientAuthenticated:
        frontendClient.userState?.status === 'authenticated',
    };
  }, [frontendClient.userState?.status]);

  useEffect(() => {
    if (!walletPublicKey || !isClientAuthenticated) return;

    console.log("Called: useUnreadState.subscribeNotificationHistoryStateChanged");

    frontendClient.subscribeNotificationHistoryStateChanged(() => {

      console.log("CallBack: subscribeNotificationHistoryStateChanged");

      frontendClient.getUnreadNotificationHistoryCount().then((res) => {
        const unreadNotificationCount = res.count;
        setUnreadNotificationCount(unreadNotificationCount);
      });
    });
  }, [isClientAuthenticated, walletPublicKey, isUsingFrontendClient]);

  return { hasUnreadNotification, unreadNotificationCount };
};
