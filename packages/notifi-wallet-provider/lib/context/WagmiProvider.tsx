import React, { useMemo } from 'react';
import { WagmiConfig } from 'wagmi';

import { ConfigArgs, getConfig } from '../utils/wagmi';

export type WagmiProviderProps = ConfigArgs & {
  children: React.ReactNode;
};

export const NotifiWagmiProvider = ({
  children,
  ...props
}: WagmiProviderProps) => {
  const config = useMemo(
    () => getConfig(props),
    [props.coinbaseWalletAppName, props.walletConnectProjectId],
  );

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
