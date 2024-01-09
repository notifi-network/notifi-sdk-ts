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

  const tenantId = process.env.REACT_APP_TENANT_ID;
  const env = process.env.REACT_APP_ENV;

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
        dappAddress={tenantId}
        walletBlockchain="ACALA"
        accountAddress={acalaAddress}
        walletPublicKey={polkadotPublicKey!}
        env={env}
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
