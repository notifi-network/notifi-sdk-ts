'use client';

import { useGoogleOauth2Context } from '@/context/GoogleOauth2Context';
import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const tenantId =
    searchParams.get('tenantid') ?? process.env.NEXT_PUBLIC_TENANT_ID ?? null;
  const env =
    (searchParams.get('env') as NotifiEnvironment) ??
    (process.env.NEXT_PUBLIC_ENV as NotifiEnvironment) ??
    null;
  const cardId =
    searchParams.get('cardid') ?? process.env.NEXT_PUBLIC_CARD_ID ?? null;

  if (!tenantId || !env || !cardId)
    throw new Error('ERROR: cannot find tenantId, env, or cardId');
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
