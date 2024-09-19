'use client';

import { useGoogleOauth2Context } from '@/context/GoogleOauth2Context';
import { isNotifiEnv } from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { PropsWithChildren } from 'react';

export const oidcModeStateLocalStorageKey = 'NotifiReactExampleOidcMode';

export interface CustomJwtPayload extends JwtPayload {
  email: string;
  name?: string;
}

export type NotifiReactExampleOIDC = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { getIdToken, idToken } = useGoogleOauth2Context();
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? null;

  const env = isNotifiEnv(process.env.NEXT_PUBLIC_ENV)
    ? process.env.NEXT_PUBLIC_ENV
    : null;
  const cardId = process.env.NEXT_PUBLIC_CARD_ID ?? null;

  if (!tenantId || !env || !cardId)
    throw new Error(
      'ERROR: cannot find tenantId, env, or cardId. Make sure you have a .env.local file',
    );
  return (
    <>
      {!idToken ? (
        <div
          className="btn"
          onClick={async () => {
            await getIdToken();
          }}
        >
          getIdToken
        </div>
      ) : null}
      {idToken ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          walletBlockchain={'OFF_CHAIN'}
          userAccount={(jwtDecode(idToken) as CustomJwtPayload).email}
          signIn={async () => ({
            oidcProvider: 'GOOGLE',
            jwt: idToken,
          })}
          cardId={cardId}
          notificationCountPerPage={8}
        >
          <h1>{(jwtDecode(idToken) as CustomJwtPayload).name}</h1>
          <h1>{(jwtDecode(idToken) as CustomJwtPayload).email}</h1>
          {children}
        </NotifiContextProvider>
      ) : null}
    </>
  );
};
