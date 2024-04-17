'use client';

import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';

export default function Home() {
  const { wallets } = useWallets();
  const router = useRouter();
  return (
    <div>
      {objectKeys(wallets)
        .filter(
          (wallet) => wallet === 'metamask' && wallets[wallet].isInstalled,
        )
        .map((wallet) => {
          return (
            <div
              key={wallet}
              className="bg-white size-32 flex items-center justify-center flex-col gap-3 rounded-lg border border-gray-600/10 cursor-pointer"
              onClick={() => {
                wallets[wallet].connect().then(() => router.push('/notifi'));
                /** No need to handle loading and error case, use `const {isLoading, error} = useWallets()  */
              }}
            >
              <div>{wallet}</div>
            </div>
          );
        })}
    </div>
  );
}
