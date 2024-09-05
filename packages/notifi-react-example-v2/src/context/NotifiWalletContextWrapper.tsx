'use client';

import { NotifiWalletProvider } from '@notifi-network/notifi-wallet-provider';

export const NotifiWalletContextWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <h3>Read me before getting started</h3>
      <p>
        This is a simple example of how to use the
        "@notifi-network/notifi-react" package
      </p>

      <NotifiWalletProvider>{children}</NotifiWalletProvider>
    </>
  );
};
