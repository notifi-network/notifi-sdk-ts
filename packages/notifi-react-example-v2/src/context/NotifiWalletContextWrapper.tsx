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
      <ul>
        <li>
          Make sure your browser{' '}
          <span style={{ fontWeight: 800 }}>
            has at least one following supported wallets installed
          </span>
          . Click any of them and connect to the wallet. (If you can not see the
          buttons below, please make sure you are under root url "/")
        </li>
      </ul>

      <NotifiWalletProvider>{children}</NotifiWalletProvider>
    </>
  );
};
