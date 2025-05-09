'use client';

import {
  ActionHandler,
  NotifiSmartLink,
  useNotifiSmartLinkContext,
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { usePathname } from 'next/navigation';
import React from 'react';

export const NotifiSmartLinkExample: React.FC = () => {
  const { wallets, selectedWallet } = useWallets();
  const { authParams, updateActionUserInputs, actionDictionary } =
    useNotifiSmartLinkContext();
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

  const actionHandler: ActionHandler = React.useCallback(
    async (args) => {
      if (!selectedWallet || selectedWallet !== 'metamask') return;
      if (!args.payload.transactions) return;

      const smartLinkIdWithActionId: `${string}:;:${string}` = `${args.smartLinkId}:;:${args.actionId}`;
      console.info('Action triggered (react-example-v2)', {
        selectedWallet,
        args,
        authParams,
        userInputs: actionDictionary[smartLinkIdWithActionId].userInputs,
      });

      try {
        await wallets[selectedWallet].sendTransaction(
          JSON.parse(args.payload.transactions[0].UnsignedTransaction),
        );
      } finally {
        /* Reset the user inputs to the initial state */
        updateActionUserInputs(smartLinkIdWithActionId);
      }
    },
    [selectedWallet, wallets, actionDictionary],
  );

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
          actionHandler={actionHandler}
        />
      </div>
    </div>
  );
};
