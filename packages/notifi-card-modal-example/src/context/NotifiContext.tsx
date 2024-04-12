'use client';

import { NotifiContextWrapper } from '@notifi-network/notifi-card-modal';
import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import { PropsWithChildren } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any; // ref:  NotifiParams['walletBlockchain']
const cardId = process.env.NEXT_PUBLIC_CARD_ID!;

export const NotifiCardModalContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();
  if (
    !selectedWallet ||
    !wallets[selectedWallet].walletKeys ||
    !wallets[selectedWallet].signArbitrary
  )
    return null;
  // let accountAddress = '';
  let walletPublicKey = '';
  let signMessage;
  if (selectedWallet) {
    // accountAddress = wallets[selectedWallet].walletKeys?.bech32 ?? '';
    switch (selectedWallet) {
      // case 'keplr':
      //   walletPublicKey = wallets[selectedWallet].walletKeys?.base64 ?? '';
      //   if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
      //   signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
      //     const result = await wallets[selectedWallet].signArbitrary(message);

      //     if (!result) throw new Error('ERROR: invalid signature');
      //     return Buffer.from(result.signature, 'base64');
      //   };
      //   break;
      case 'metamask':
        walletPublicKey = wallets[selectedWallet].walletKeys?.hex ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const messageString = Buffer.from(message).toString('utf8');
          const result = await wallets[selectedWallet].signArbitrary(
            messageString,
          );
          if (!result) throw new Error('ERROR: invalid signature');
          return getBytes(result);
        };
        break;
    }
  }
  console.log({ signMessage });

  if (!signMessage) return <div>No available wallet to sign</div>;

  return (
    <NotifiContextWrapper
      tenantId={tenantId}
      env={env}
      walletBlockchain="ETHEREUM"
      walletPublicKey={walletPublicKey}
      signMessage={signMessage}
      cardId={cardId}
    >
      {children}
    </NotifiContextWrapper>
  );
};
