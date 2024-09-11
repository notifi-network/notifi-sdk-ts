'use client';

import { useGoogleOauth2Context } from '@/context/GoogleOauth2Context';
import { CustomJwtPayload } from '@/context/NotifiContextWrapper';
import {
  NotifiCardModal,
  useNotifiFrontendClientContext,
} from '@notifi-network/notifi-react';
import { initWebPushServiceWorker } from '@notifi-network/notifi-web-push-service-worker';
import { tryCreateWebPushSubscription } from '@notifi-network/notifi-web-push-service-worker';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

export default function Home() {
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const { idToken } = useGoogleOauth2Context();
  React.useEffect(() => {
    initWebPushServiceWorker();
  }, []);

  const enableWebPush = React.useCallback(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    if (frontendClientStatus.isAuthenticated && idToken) {
      const userAccount = (jwtDecode(idToken) as CustomJwtPayload).email;
      tryCreateWebPushSubscription(
        userAccount,
        process.env.NEXT_PUBLIC_TENANT_ID ?? '',
        process.env.NEXT_PUBLIC_ENV ?? '',
      );
    }
  }, [frontendClientStatus.isAuthenticated, idToken]);

  return (
    <div>
      {Notification.permission !== 'granted' ? (
        <div onClick={() => Notification.requestPermission()}>
          Enable Browser notification permission
        </div>
      ) : null}
      {Notification.permission === 'granted' ? (
        <>
          <div className="btn" onClick={enableWebPush}>
            Enable notifi web push
          </div>
          <div className="notifi-card-modal-container">
            <NotifiCardModal darkMode />
          </div>
        </>
      ) : null}
    </div>
  );
}
