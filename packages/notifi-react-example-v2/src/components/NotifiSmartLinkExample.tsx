'use client';

import {
  NotifiSmartLink,
  useNotifiSmartLinkContext,
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export const NotifiSmartLinkExample: React.FC = () => {
  const { wallets, selectedWallet } = useWallets();
  const { authParams } = useNotifiSmartLinkContext();
  const currentPath = usePathname();
  const [smartLinkId, setSmartLinkId] = React.useState<string>();
  useEffect(() => {
    const smartLinkId = currentPath.split('/').pop();
    setSmartLinkId(smartLinkId);
  }, [currentPath]);

  if (!smartLinkId) {
    return null;
  }

  return (
    <div>
      <h3>Smart Link Example: metamask</h3>
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
    </div>
  );
};
