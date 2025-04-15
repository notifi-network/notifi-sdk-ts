'use client';

import {
  NotifiSmartLink,
  NotifiSmartLinkContextProvider,
  useNotifiSmartLinkContext,
} from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Page() {
  const { wallets, selectedWallet } = useWallets();
  const { authParams } = useNotifiSmartLinkContext();
  const currentPath = usePathname();

  const smartLinkId = currentPath.split('/').pop();
  console.log('smartLinkId', smartLinkId);
  if (!smartLinkId) {
    return <div>Smart Link ID is required</div>;
  }
  return (
    <div>
      <div>
        <h3>Smart Link Example: metamask</h3>
        <NotifiSmartLinkContextProvider
          env={'Development'}
          authParams={{
            walletPublicKey:
              selectedWallet === 'metamask'
                ? (wallets[selectedWallet].walletKeys?.hex ?? '')
                : '',
            walletBlockchain: 'ARBITRUM',
          }}
        >
          <NotifiSmartLink
            smartLinkId={smartLinkId}
            preAction={{
              isRequired: selectedWallet !== 'metamask',
              onClick: async () => {
                if (!selectedWallet) {
                  wallets['metamask'].connect();
                }
              },
              label: 'Connect EVM Wallet',
            }}
            actionHandler={async (args) => {
              console.log('Action triggered (react-example-v2)', {
                args,
                authParams,
              });
            }}
          />
        </NotifiSmartLinkContextProvider>
      </div>
    </div>
  );
}
