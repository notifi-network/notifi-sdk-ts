'use client';

import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import {
  NotifiCardModal,
  NotifiCardModalProps,
  NotifiContextProvider,
} from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export const oidcModeStateLocalStorageKey = 'NotifiReactExampleOidcMode';
export enum OidcModeState {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}
const oidcLocalStorageKey = 'NotifiReactExampleOidcData';
export type NotifiReactExampleOIDC = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

// Extend JwtPayload to whatever supported interface your OIDC provider supports (This case is Google OAuth2)
interface CustomJwtPayload extends JwtPayload {
  email: string;
  name?: string;
}

export default function OidcGoogle() {
  // NOTE: Validate Notifi environment, tenantId, and cardId
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

  const router = useRouter();
  const [oneTimeCode, setOneTimeCode] = React.useState<string | null>(null);
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [oidcData, setOidcData] = React.useState<NotifiReactExampleOIDC>({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
  });

  const clientIdInputRef = React.useRef<HTMLInputElement>(null);
  const clientSecretInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // NOTE: initial load credentials from localStorage
    const oidcData = JSON.parse(
      localStorage.getItem(oidcLocalStorageKey) ?? '{}',
    ) as NotifiReactExampleOIDC;

    setOidcData(oidcData);

    // NOTE: initial parse one-time code from URL
    const regex = /code=([^&]*)/;
    const urlParams = window.location.href.match(regex);
    if (!urlParams?.length || urlParams.length < 1) return;
    const oneTimeCode = urlParams[1];
    setOneTimeCode(() => decodeURIComponent(oneTimeCode));
  }, []);

  if (!oidcData.clientId || !oidcData.clientSecret || !oidcData.redirectUri) {
    // TODO: Migrate to new component for other OIDC providers
    return (
      <div>
        <h1>Input Google OAuth2 client id</h1>
        <input type="text" ref={clientIdInputRef} />
        <h1>Input Google OAuth2 client secret</h1>
        <input type="text" ref={clientSecretInputRef} />
        <br></br>
        <br></br>
        <button
          onClick={() => {
            const newOidcData = {
              clientId: clientIdInputRef.current?.value ?? '',
              clientSecret: clientSecretInputRef.current?.value ?? '',
              redirectUri: window.location.origin,
            };
            setOidcData(newOidcData);
            localStorage.setItem(
              oidcLocalStorageKey,
              JSON.stringify(newOidcData),
            );
          }}
        >
          Save
        </button>
        <div
          style={{
            backgroundColor: 'lightgray',
            padding: '1rem 1rem',
            marginTop: '1rem',
          }}
        >
          <h2>IMPORTANT:</h2>
          <h3>
            Make sure the redirect_uri config in google OAuth2 client to be{' '}
            <span style={{ backgroundColor: 'orange' }}>
              {window.location.origin}
            </span>
          </h3>
        </div>
      </div>
    );
  }

  const deriveIdTokenFromOneTimeCode = async (code: string) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: oidcData.clientId,
        client_secret: oidcData.clientSecret,
        redirect_uri: oidcData.redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const result = await response.json();
    return result;
  };

  return (
    <>
      {!oneTimeCode ? (
        <div>
          <button
            onClick={async () => {
              window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${oidcData.clientId}&redirect_uri=${oidcData.redirectUri}&response_type=code&scope=email%20profile&access_type=offline`;
            }}
          >
            Login with Google
          </button>
          <br></br>
          <button
            onClick={() => {
              localStorage.removeItem(oidcLocalStorageKey);
              setOidcData({
                ...oidcData,
                clientId: '',
                clientSecret: '',
              });
              // window.location.reload();
            }}
          >
            Reset the google OAuth2 credentials
          </button>
        </div>
      ) : null}
      {oneTimeCode && !idToken ? (
        <div>
          <button
            onClick={async () => {
              const result = await deriveIdTokenFromOneTimeCode(oneTimeCode);
              if (result.error) {
                alert(result.error);
              }
              setIdToken(() => result.id_token);
              router.push('/');
            }}
          >
            Get ID token (JWT)
          </button>
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
          <div className="notifi-card-modal-container">
            <NotifiCardModal
              darkMode={searchParams.get('scene') === 'light' ? false : true}
              copy={copy}
            />
          </div>
        </NotifiContextProvider>
      ) : null}
    </>
  );
}

// Constants & utils

const copy: NotifiCardModalProps['copy'] = {
  Ftu: {
    FtuTargetEdit: {
      TargetInputs: {
        inputSeparators: {
          email: 'OR',
          sms: 'OR',
          telegram: 'OR',
          discord: 'OR',
        },
      },
    },
  },
  Inbox: {
    InboxConfigTargetEdit: {
      TargetInputs: {
        inputSeparators: {
          email: 'OR',
          sms: 'OR',
          telegram: 'OR',
          discord: 'OR',
        },
      },
    },
  },
};
