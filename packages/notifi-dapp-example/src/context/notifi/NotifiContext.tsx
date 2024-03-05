'use client';

import { WalletAccount } from '@cosmos-kit/core';
import { useWalletClient } from '@cosmos-kit/react';
import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any; // ref:  NotifiParams['walletBlockchain']

export const NotifiContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // TODO: Rename context to NotifiContextProvider
  const { client, status } = useWalletClient();

  const [account, setAccount] = useState<WalletAccount | null>(null);

  useEffect(() => {
    if (status === 'Done' && client?.getAccount) {
      client.getAccount('injective-1').then((account) => setAccount(account));
    }
  }, [status]);

  const base64Pubkey = useMemo(
    () => (account ? Buffer.from(account.pubkey).toString('base64') : null),
    [account?.address],
  );

  if (!account || !base64Pubkey || !client?.signArbitrary) {
    return null;
  }

  return (
    <NotifiContext
      dappAddress={tenantId}
      walletBlockchain={walletBlockchain}
      env={env}
      walletPublicKey={base64Pubkey}
      accountAddress={account.address}
      signMessage={async (message: Uint8Array): Promise<Uint8Array> => {
        if (!client?.signArbitrary) throw new Error('no signArbitrary method');
        const result = await client.signArbitrary(
          'injective-1',
          account.address,
          message,
        );
        return Buffer.from(result.signature, 'base64');
      }}
    >
      {children}
    </NotifiContext>
  );
};
