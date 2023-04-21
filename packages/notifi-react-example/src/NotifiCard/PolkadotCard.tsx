import { AcalaConnectButton } from '../walletProviders/AcalaWalletContextProvider';

export const PolkadotCard = () => {
  return (
    <div className="container">
      <h1>Notifi Card: Polkadot</h1>
      <AcalaConnectButton />
    </div>
  );
};
