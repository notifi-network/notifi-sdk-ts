import { Uint8SignMessageFunction } from '@notifi-network/notifi-core';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import { EthosConnectStatus, SignInButton, ethos } from 'ethos-connect';
import React, { PropsWithChildren } from 'react';

export const SuiNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const tenantId = process.env.REACT_APP_TENANT_ID;
  const env = process.env.REACT_APP_ENV;
  const { status, wallet } = ethos.useWallet();

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const signature = await wallet.signPersonalMessage({
      message,
    });

    const signatureBuffer = Buffer.from(signature.signature);
    return signatureBuffer;
  };

  return (
    <div className="container">
      {status === EthosConnectStatus.Connected && wallet ? (
        <NotifiContext
          dappAddress={tenantId}
          walletBlockchain="SUI"
          env={env}
          accountAddress={wallet.address}
          walletPublicKey={wallet.address}
          signMessage={signMessage}
        >
          {children}
        </NotifiContext>
      ) : (
        <SignInButton>CONNECT SUI WALLET</SignInButton>
      )}
    </div>
  );
};
