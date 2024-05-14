import React, { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';

import { config } from '../utils/wagmi';

export const NotifiWagmiProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
