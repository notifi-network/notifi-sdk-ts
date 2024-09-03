'use client';

import OidcGoogle, {
  OidcModeState,
  oidcModeStateLocalStorageKey,
} from '@/components/OidcGoogle';
import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { Types, useWallets } from '@notifi-network/notifi-wallet-provider';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const { wallets } = useWallets();
  const router = useRouter();
  const [isOidcGoogle, setIsOidcGoogle] = React.useState<boolean | null>(null);

  const supportedWallets: (keyof Types.Wallets)[] = [
    'metamask',
    'keplr',
    'coinbase',
    'phantom',
  ];

  React.useEffect(() => {
    console.log(localStorage.getItem(oidcModeStateLocalStorageKey));
    const isOidc =
      (localStorage.getItem(oidcModeStateLocalStorageKey) as OidcModeState) ===
      'ENABLED';
    setIsOidcGoogle(isOidc);
  }, []);

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
      {isOidcGoogle !== null ? (
        <button
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
          {isOidcGoogle ? 'Exist OIDC example mode' : 'Google'}
        </button>
      ) : null}
      {isOidcGoogle ? <OidcGoogle /> : null}
    </>
  );
}
