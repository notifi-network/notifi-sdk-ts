import { InjectedExtension } from '@polkadot/extension-inject/types';
import { SignerResult } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

export type AcalaWalletName = 'PolkadotJs' | 'SubWallet' | 'Talisman';

const AcalaWalletAdapterNames: Record<AcalaWalletName, string> = {
  PolkadotJs: 'polkadot-js',
  SubWallet: 'subwallet-js',
  Talisman: 'talisman',
};

export type AcalaWallets = {
  address: string;
  name?: string;
};

export type AcalaWalletContextProps = {
  acalaAddress: string | null;
  account: string | null;
  chooseAccount: (address: string) => void;
  connected: boolean;
  disconnectWallet: () => void;
  connectWallet: (walletName: AcalaWalletName) => Promise<void>;
  multipleAccounts: AcalaWallets[] | null;
  polkadotPublicKey: string | null;
  requestSignature: (
    address: string,
    message: string,
  ) => Promise<`0x${string}`>;
  walletName: AcalaWalletName | null;
};

const ACALA_PREFIX = 10;

const reformatPolkadotEcosystemAddress = (
  address: string,
  networkPrefix: number,
): string => {
  const publicKey = decodeAddress(address);

  if (networkPrefix < 0) {
    return address;
  }

  return encodeAddress(publicKey, networkPrefix);
};

const getPolkadotPublicKey = (address: string): string => {
  const publicKey = decodeAddress(address);
  const decodedPublicKey = u8aToHex(publicKey);
  return decodedPublicKey;
};

const getWalletInjection = async (
  walletName: AcalaWalletName,
): Promise<InjectedExtension | undefined> => {
  const walletInteractionName = AcalaWalletAdapterNames[walletName];
  const walletExtension = window.injectedWeb3[walletInteractionName];
  if (walletExtension) {
    const extension: InjectedExtension = await walletExtension.enable();
    return extension;
  }
};

export const AcalaWalletContext = React.createContext<AcalaWalletContextProps>(
  {} as AcalaWalletContextProps,
);

export const AcalaWalletContextProvider: FC = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [acalaAddress, setAcalaAddress] = useState<string | null>(null);
  const [polkadotPublicKey, setPolkadotPublicKey] = useState<string | null>(
    null,
  );
  const [multipleAccounts, setMultipleAccounts] = useState<
    AcalaWallets[] | null
  >(null);
  const [walletName, setWalletName] = useState<AcalaWalletName | null>(null);

  const noWalletInstalledDisplay = useCallback(
    (walletName: AcalaWalletName) => console.log('nope', walletName),
    [],
  );

  const chooseAccount = useCallback((address: string) => {
    setAccount(address);
    setConnected(true);
    setMultipleAccounts(null);
  }, []);

  //TO-DO: Migrate address conversions in BE, handled in FE for now because Polkadot library in JS is simplier to use
  useEffect(() => {
    async function getAdditionalAddresses() {
      if (account === null) {
        return;
      }

      const convertToAcalaAddress = await reformatPolkadotEcosystemAddress(
        account,
        ACALA_PREFIX,
      );
      const convertToPublicKey = await getPolkadotPublicKey(account);
      if (convertToAcalaAddress) setAcalaAddress(convertToAcalaAddress);
      if (convertToPublicKey) setPolkadotPublicKey(convertToPublicKey);
    }
    if (account) {
      getAdditionalAddresses();
    }
  }, [account]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setPolkadotPublicKey(null);
    setAcalaAddress(null);
    setWalletName(null);
    setMultipleAccounts(null);
    setConnected(false);
  }, []);

  const connectWallet = useCallback(
    async (walletName: AcalaWalletName) => {
      try {
        const extension = await getWalletInjection(walletName);
        setWalletName(walletName);
        if (extension === undefined) {
          setWalletName(null);
          return noWalletInstalledDisplay(walletName);
        }
        const getAccounts = await extension.accounts.get();
        if (getAccounts.length === 0) {
          setWalletName(null);
          return;
        }
        if (getAccounts.length === 1) {
          const firstAccount = getAccounts[0].address;
          chooseAccount(firstAccount);
          return;
        }
        if (getAccounts.length >= 2) {
          const updatedWalletAddresses = getAccounts.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ genesisHash, type, ...item }) => item,
          );
          setMultipleAccounts(updatedWalletAddresses);
        }
      } catch (e) {
        disconnectWallet();
      }
    },
    [chooseAccount, disconnectWallet, noWalletInstalledDisplay],
  );

  const requestSignature = useCallback(
    async (address: string, message: string): Promise<`0x${string}`> => {
      if (walletName === null) {
        throw new Error('Select wallet');
      }
      try {
        const extension = await getWalletInjection(walletName);
        if (extension && extension.signer && extension.signer.signRaw) {
          const signPromise: SignerResult = await extension.signer.signRaw({
            address,
            data: message,
            type: 'bytes',
          });
          return signPromise.signature;
        }
      } catch (e) {
        disconnectWallet();
        throw e;
      }

      throw new Error('Oops');
    },
    [disconnectWallet, walletName],
  );

  useEffect(() => {
    if (account !== null) {
      return;
    } else if (multipleAccounts !== null && multipleAccounts.length > 0) {
      chooseAccount(multipleAccounts[0].address);
    } else {
      setTimeout(() => connectWallet('PolkadotJs'), 2000);
    }
  }, [account, chooseAccount, connectWallet, multipleAccounts]);

  const values: AcalaWalletContextProps = useMemo(
    () => ({
      acalaAddress,
      account,
      chooseAccount,
      connectWallet,
      connected,
      disconnectWallet,
      multipleAccounts,
      polkadotPublicKey,
      requestSignature,
      walletName,
    }),
    [
      acalaAddress,
      account,
      chooseAccount,
      connectWallet,
      connected,
      disconnectWallet,
      multipleAccounts,
      polkadotPublicKey,
      requestSignature,
      walletName,
    ],
  );

  return (
    <AcalaWalletContext.Provider value={values}>
      {children}
    </AcalaWalletContext.Provider>
  );
};

export const useAcalaWallet = () => {
  const context = React.useContext(AcalaWalletContext);

  if (context === undefined) {
    throw new Error(
      'useAcalaContext hook must be used with a AcalaContextProvider component',
    );
  }

  return context;
};
