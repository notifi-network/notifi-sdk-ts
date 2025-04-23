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
  const { authParams, updateActionUserInputs } = useNotifiSmartLinkContext();
  const currentPath = usePathname();

  const smartLinkId = React.useMemo(() => {
    const smartLinkId = currentPath.split('/').pop();
    return smartLinkId;
  }, [currentPath]);

  if (!smartLinkId) {
    return null;
  }
  const preAction = React.useMemo(() => {
    if (selectedWallet !== 'metamask' || !wallets['metamask'].isInstalled) {
      return {
        onClick: async () => {
          if (!wallets['metamask'].isInstalled) {
            window.open('https://metamask.io/', '_blank');
            return;
          }
          await wallets['metamask'].connect();
        },
        label: !wallets['metamask'].isInstalled
          ? 'Install Wallet (Metamask)'
          : 'Connect Wallet (Metamask)',
        disabled: false,
        onError: (e: Error) => console.log(`We got an error: ${e.message}`),
      };
    }
  }, [selectedWallet, wallets]);

  return (
    <div>
      {!!selectedWallet && wallets[selectedWallet] ? (
        <button
          onClick={async () => await wallets[selectedWallet].disconnect()}
        >
          Disconnect Wallet
        </button>
      ) : null}
      <h3>Smart Link Example: metamask</h3>
      <div className="notifi-smartlink-container">
        <NotifiSmartLink
          smartLinkId={smartLinkId}
          preAction={preAction}
          actionHandler={async (args) => {
            console.log('Action triggered (react-example-v2)', {
              selectedWallet,
              args,
              authParams,
            });
            if (!selectedWallet || selectedWallet !== 'metamask') return;
            if (!args.payload.transactions) return;

            const smartLinkIdWithActionId: `${string}:;:${string}` = `${args.smartLinkId}:;:${args.actionId}`;

            try {
              await wallets[selectedWallet].sendTransaction(
                JSON.parse(args.payload.transactions[0].UnsignedTransaction),
              );
            } finally {
              /* Reset the user inputs to the initial state */
              updateActionUserInputs(smartLinkIdWithActionId);
            }
          }}
        />
      </div>
    </div>
  );
};
