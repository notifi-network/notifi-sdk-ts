'use client';

import '@notifi-network/notifi-react/dist/index.css';
import React, { PropsWithChildren } from 'react';

const oidcLocalStorageKey = 'NotifiReactExampleOidcData';
export type NotifiReactExampleOIDC = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type GoogleOauth2ContextType = {
  getIdToken: () => Promise<string | null>;
  idToken: string | null;
};
export const GoogleOauth2Context = React.createContext<GoogleOauth2ContextType>(
  {} as GoogleOauth2ContextType,
);

export const GoogleOauth2ContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [oneTimeCode, setOneTimeCode] = React.useState<string | null>(null);
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [oidcData, setOidcData] = React.useState<NotifiReactExampleOIDC>({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
  });
  const [isClient, setIsClient] = React.useState<boolean>(false);

  const clientIdInputRef = React.useRef<HTMLInputElement>(null);
  const clientSecretInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsClient(true);
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
  if (!isClient) return null;
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
          className="btn"
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

  const getIdToken = async () => {
    if (!oneTimeCode) return null;
    const result = await deriveIdTokenFromOneTimeCode(oneTimeCode);
    if (result.error) {
      alert(result.error);
      window.location.href = window.location.origin;
      return null;
    }
    setIdToken(result.id_token);
    return result.id_token;
  };

  return (
    <>
      {!oneTimeCode ? (
        <div>
          <button
            className="btn"
            onClick={async () => {
              window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${oidcData.clientId}&redirect_uri=${oidcData.redirectUri}&response_type=code&scope=email%20profile&access_type=offline`;
            }}
          >
            Login with Google
          </button>
          <br></br>
          <button
            className="btn"
            onClick={() => {
              localStorage.removeItem(oidcLocalStorageKey);
              setOidcData({
                ...oidcData,
                clientId: '',
                clientSecret: '',
              });
            }}
          >
            Reset the google OAuth2 credentials
          </button>
        </div>
      ) : (
        <GoogleOauth2Context.Provider
          value={{
            getIdToken,
            idToken,
          }}
        >
          {children}
        </GoogleOauth2Context.Provider>
      )}
    </>
  );
};

export const useGoogleOauth2Context = () =>
  React.useContext(GoogleOauth2Context);
