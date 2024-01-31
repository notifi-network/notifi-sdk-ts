'use client';

/** Note: This wrapper is to resolve the rendering client components in server component (RootLayout) */
import { NotifiWalletProvider } from '@notifi-network/notifi-wallet-provider';
import React, { FC, PropsWithChildren } from 'react';

export const NotifiWalletsWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <NotifiWalletProvider>{children}</NotifiWalletProvider>;
};
