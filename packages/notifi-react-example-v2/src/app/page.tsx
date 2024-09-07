'use client';

import OidcGoogle, {
  OidcModeState,
  oidcModeStateLocalStorageKey,
} from '@/components/OidcGoogle';
import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { Types, useWallets } from '@notifi-network/notifi-wallet-provider';
import { useRouter } from 'next/navigation';
import React from 'react';
import { initWebPushServiceWorker } from '@notifi-network/notifi-web-push-service-worker';

function unsubscribePushManger() {
  navigator.serviceWorker.ready.then((reg) => {
    reg.pushManager.getSubscription().then((subscription) => {
      if (subscription) {
        subscription
          .unsubscribe()
          .then((successful) => {
            console.log("Successfully unsubscribe push manager")
          })
          .catch((e) => {
            console.error("Failed to unsusbcribe push manager")
          });
      }
    });
  });
}

export default function Home() {
  const { wallets } = useWallets();
  const router = useRouter();
  const [isOidcGoogle, setIsOidcGoogle] = React.useState<boolean | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  const supportedWallets: (keyof Types.Wallets)[] = [
    'metamask',
    'keplr',
    'coinbase',
    'phantom',
  ];


  React.useEffect(() => {
    initWebPushServiceWorker()
  }, []);

  React.useEffect(() => {
    setIsClient(true);
    const isOidc =
      (localStorage.getItem(oidcModeStateLocalStorageKey) as OidcModeState) ===
      'ENABLED';
    setIsOidcGoogle(isOidc);
  }, []);

  const isLocalhost = () => {
    if (typeof window === 'undefined') return false;
    return window.location.origin.startsWith('http://localhost');
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <>
      {!isOidcGoogle ? (
        <>
          <h3>Blockchain Auth</h3>
          <ul>
            <li>
              Make sure your browser{' '}
              <span style={{ fontWeight: 800 }}>
                has at least one following supported wallets installed
              </span>
            </li>
            <li>
              Click any of them and connect to the wallet. (If you can not see
              the buttons below, please make sure you are under root url "/")
            </li>
          </ul>

          {objectKeys(wallets)
            .filter(
              (wallet) =>
                supportedWallets.includes(wallet) &&
                wallets[wallet].isInstalled,
            )
            .map((wallet) => {
              return (
                <button
                  className="plain-button"
                  key={wallet}
                  onClick={() => {
                    wallets[wallet]
                      .connect()
                      .then(() => router.push('/notifi'));
                  }}
                >
                  <div>{wallet}</div>
                </button>
              );
            })}
        </>
      ) : null}
      <h3>OIDC (OpenID Connect) Auth</h3>
      {isOidcGoogle !== null || isLocalhost() ? (
        <button
          className="plain-button"
          onClick={() => {
            setIsOidcGoogle((prev) => {
              localStorage.setItem(
                oidcModeStateLocalStorageKey,
                prev
                  ? ('DISABLE' as OidcModeState)
                  : ('ENABLED' as OidcModeState),
              );
              return !prev;
            });
          }}
        >
          {isOidcGoogle ? 'Exit OIDC example mode' : 'Google'}
        </button>
      ) : null}
      <button
        className="plain-button"
        onClick={() => {
          unsubscribePushManger();
        }}
      >
        Unsubscribe push subscription
      </button>
      {isOidcGoogle ? <OidcGoogle /> : null}
      {!isLocalhost() ? (
        <div>
          OIDC example only available in local environment. For more detail,
          checkout the README.md of `@notifi-network/notifi-react-example-v2`
        </div>
      ) : null}
    </>
  );
}
