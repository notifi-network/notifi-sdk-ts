'use client';

import { NotifiSmartLink } from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React from 'react';

export default function NotifiSmartLinkExample() {
  const [smartLinkId, setSmartLinkId] = React.useState<string>();
  const { wallets, selectedWallet } = useWallets();
  return (
    <div>
      <input
        placeholder="Enter smart link id"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setSmartLinkId(e.currentTarget.value);
          }
        }}
      />
      {smartLinkId ? (
        <NotifiSmartLink
          smartLinkId={smartLinkId}
          actionHandler={async (args) => {
            console.log('actionHandler', args);
            console.log({ selectedWallet });
            if (!selectedWallet) return;
            if ('sendTransaction' in wallets[selectedWallet]) {
              // TODO: Below only for test sending transaction, need remove
              // if (selectedWallet === 'metamask') {
              //   wallets[selectedWallet].sendTransaction({
              //     from: wallets[selectedWallet].walletKeys?.hex,
              //     to: wallets[selectedWallet].walletKeys?.hex,
              //   });
              // }

              // TODO: Impl executeAction (Payload is {} for now)
              const { payload } = args;
              const encodedTxs = payload.transactions;
              // TODO: Serialize the transaction
              if (!encodedTxs) return;
              for (const encodedTx of encodedTxs) {
                const wa = wallets[selectedWallet];
                const { blockchainType, UnsignedTransaction } = encodedTx;
                const serializedTx = serializeTx(UnsignedTransaction);
                if (selectedWallet === 'metamask') {
                  // TODO: Sign the transaction
                  await wallets[selectedWallet].sendTransaction(serializedTx);
                }
              }
            }
          }}
        />
      ) : null}
    </div>
  );
}

// Utils

const serializeTx = (encodedTx: string): object => {
  // TODO: Implement the serialization logic
  return {};
};
