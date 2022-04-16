import localforage from 'localforage';
import React, { useCallback, useMemo, useState } from 'react';

localforage.config({
  name: 'notifi',
});

const useNotifiJwt = (
  dappAddress: string,
  walletPublicKey: string,
  jwtPrefix: string,
): Readonly<{
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}> => {
  const key = useMemo(
    () => `${jwtPrefix}:${dappAddress}:${walletPublicKey}`,
    [jwtPrefix, dappAddress, walletPublicKey],
  );

  const [jwt, setJwtRaw] = useState<string | null>(null);

  React.useEffect(() => {
    const getItem = async () => {
      const value = await localforage.getItem<string>(key);
      setJwtRaw(value);
    };

    getItem().catch((_e: unknown) => {
      setJwtRaw(null);
    });
  }, [key, setJwtRaw]);

  const setJwt = useCallback(
    (jwt: string | null): void => {
      const setItem = async () => {
        await localforage.setItem(key, jwt);
        setJwtRaw(jwt);
      };

      setItem().catch((_e: unknown) => {
        /* Intentionally ignore failure to save Jwt */
      });
    },
    [key, setJwtRaw],
  );

  return { jwt, setJwt };
};

export default useNotifiJwt;
