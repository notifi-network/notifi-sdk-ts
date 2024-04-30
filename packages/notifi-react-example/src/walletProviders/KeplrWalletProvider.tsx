import type { Keplr, Window as KeplrWindow, Key } from '@keplr-wallet/types';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const getKeplrFromWindow: () => Promise<Keplr> = () => {
  const win = window as KeplrWindow;
  const keplr = win.keplr;
  if (keplr !== undefined) {
    return Promise.resolve(keplr);
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Keplr extension');
  }

  return new Promise<Keplr>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const innerKeplr = win.keplr;
        if (innerKeplr) {
          resolve(innerKeplr);
        } else {
          reject('Please install the Keplr extension');
        }

        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };

    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};

export type KeplrContextData = Readonly<{
  key: Key | undefined;
  connect: () => Promise<void>;
  signArbitrary: Keplr['signArbitrary'];
}>;

const KeplrContext = createContext<KeplrContextData>({
  key: undefined,
  connect: () => {
    throw new Error('Unimplemented');
  },
  signArbitrary: () => {
    throw new Error('Unimplemented');
  },
});

export const useKeplrContext = () => useContext(KeplrContext);

export const KeplrWalletProvider: FC<PropsWithChildren<{}>> = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [keplr, setKeplr] = useState<Keplr | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [key, setKey] = useState<Key | undefined>(undefined);

  useEffect(() => {
    getKeplrFromWindow()
      .then(async (keplr) => {
        setKeplr(keplr);
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(`Unknown error: ${e}`);
        }
      });
  });

  const connect = useCallback(async () => {
    if (keplr === undefined) {
      setError('Wait for initialization');
      return;
    }

    await keplr.enable('injective-1');
    const key = await keplr.getKey('injective-1');
    setKey(key);
  }, [keplr]);

  const signArbitrary = useCallback<Keplr['signArbitrary']>(
    async (chainId: string, signer: string, data: string | Uint8Array) => {
      if (keplr !== undefined) {
        const result = await keplr.signArbitrary(chainId, signer, data);
        return result;
      }

      throw new Error('Wait for initialization');
    },
    [keplr],
  );

  return (
    <KeplrContext.Provider
      value={{
        key,
        connect,
        signArbitrary,
      }}
    >
      <div>
        {error !== undefined ? <p>{error}</p> : null}
        {children}
      </div>
    </KeplrContext.Provider>
  );
};
