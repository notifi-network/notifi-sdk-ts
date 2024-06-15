import React, { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../utils/wagmi';

export const NotifiWagmiProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
