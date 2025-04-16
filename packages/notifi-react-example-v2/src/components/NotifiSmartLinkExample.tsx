'use client';

import {
  NotifiSmartLink,
  useNotifiSmartLinkContext,
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { usePathname } from 'next/navigation';
import React from 'react';

export const NotifiSmartLinkExample: React.FC = () => {
  const { wallets, selectedWallet } = useWallets();
  const { authParams } = useNotifiSmartLinkContext();
  const currentPath = usePathname();

  const smartLinkId = React.useMemo(() => {
    const smartLinkId = currentPath.split('/').pop();
    return smartLinkId;
  }, [currentPath]);

  if (!smartLinkId) {
    return null;
  }

  return (
    <div>
      <h3>Smart Link Example: metamask</h3>
      <div style={{ padding: '1.5rem' }}>
        <NotifiSmartLink
          smartLinkId={smartLinkId}
          preAction={{
            isRequired:
              selectedWallet !== 'metamask' || !wallets['metamask'].isInstalled,
            onClick: async () => {
              if (!wallets['metamask'].isInstalled) {
                window.open('https://metamask.io/', '_blank');
                return;
              }
              wallets['metamask'].connect();
            },
            label: !wallets['metamask'].isInstalled
              ? 'Install Wallet (Metamask)'
              : 'Connect Wallet (Metamask)',
          }}
          actionHandler={async (args) => {
            console.log('Action triggered (react-example-v2)', {
              args,
              authParams,
            });
          }}
        />
      </div>
    </div>
  );
};
