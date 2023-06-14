import { NotifiContext } from '@notifi-network/notifi-react-card';
import { PropsWithChildren } from 'react';

import {
  AcalaConnectButton,
  useAcalaWallet,
} from '../walletProviders/AcalaWalletContextProvider';

export const PolkadotNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { requestSignature, acalaAddress, connected, polkadotPublicKey } =
    useAcalaWallet();

  if (!connected || !acalaAddress) {
    return (
      <div>
        <AcalaConnectButton />
      </div>
    );
  }

  return (
    <div className="container">
      <AcalaConnectButton />

      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="ACALA"
        accountAddress={acalaAddress}
        walletPublicKey={polkadotPublicKey!}
        env="Development"
        signMessage={(accountAddress, message) => {
          console.log({ accountAddress, acalaAddress, message });
          return requestSignature(acalaAddress, message);
        }}
      >
        {children}
      </NotifiContext>
    </div>
  );
};
