import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React, { PropsWithChildren, useMemo } from 'react';

import { useKeplrContext } from '../walletProviders/KeplrWalletProvider';

export const KeplrConnectButton: React.FC = () => {
  const { key, connect } = useKeplrContext();
  return (
    <button onClick={connect}>
      {key !== undefined ? key.bech32Address : 'Connect'}
    </button>
  );
};

const tenantId = process.env.REACT_APP_TENANT_ID!;
const env = process.env.REACT_APP_ENV! as NotifiEnvironment;

export const KeplrNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { key, signArbitrary } = useKeplrContext();
  const keyBase64 = useMemo(
    () =>
      key !== undefined
        ? Buffer.from(key.pubKey).toString('base64')
        : undefined,
    [key],
  );

  return (
    <div className="container">
      <h1>Notifi Card: Injective (Keplr)</h1>
      <KeplrConnectButton />
      {key !== undefined && keyBase64 !== undefined ? (
        <NotifiContext
          dappAddress={tenantId}
          walletBlockchain="INJECTIVE"
          env={env}
          walletPublicKey={keyBase64}
          accountAddress={key.bech32Address}
          signMessage={async (message: Uint8Array): Promise<Uint8Array> => {
            const result = await signArbitrary(
              'injective-1',
              key.bech32Address,
              message,
            );
            return Buffer.from(result.signature, 'base64');
          }}
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
