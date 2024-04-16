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

    // frontendClient.stateChanged().then((res) => {
    //   console.log(JSON.stringify(res));
    // });
    console.log("Called: useUnreadState.subscribeNotificationHistoryStateChanged");
    frontendClient.subscribeNotificationHistoryStateChanged(() => {
      console.log("CallBack: subscribeNotificationHistoryStateChanged");
      frontendClient.getUnreadNotificationHistoryCount().then((res) => {
        const unreadNotificationCount = res.count;
        setUnreadNotificationCount(unreadNotificationCount);
      })
        .catch((_e) => {
          /* Intentionally empty (Concurrent can only possibly happens here instead of inside interval) */
        });
    });


    // const interval = setInterval(() => {
    //   if (!walletPublicKey || !isClientAuthenticated) return;

    //   frontendClient.getUnreadNotificationHistoryCount().then((res) => {
    //     const unreadNotificationCount = res.count;
    //     setUnreadNotificationCount(unreadNotificationCount);
    //   });
    // }, Math.floor(Math.random() * 5000) + 5000); // a random interval between 5 and 10 seconds to avoid spamming the server

    //  return () => clearInterval(interval);
  }, [isClientAuthenticated, walletPublicKey, isUsingFrontendClient]);

  return { hasUnreadNotification, unreadNotificationCount };
};
