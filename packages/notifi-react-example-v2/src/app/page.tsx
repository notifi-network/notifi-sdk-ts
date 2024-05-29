'use client';

import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { wallets } = useWallets();
  const router = useRouter();

  const supportedWallets = ['metamask', 'keplr'];

  return (
    <div>
      {objectKeys(wallets)
        .filter(
          (wallet) =>
            supportedWallets.includes(wallet) && wallets[wallet].isInstalled,
        )
        .map((wallet) => {
          return (
            <button
              key={wallet}
              onClick={() => {
                wallets[wallet].connect().then(() => router.push('/notifi'));
              }}
            >
              <div>{wallet}</div>
            </button>
          );
        })}
    </div>
  );
}
