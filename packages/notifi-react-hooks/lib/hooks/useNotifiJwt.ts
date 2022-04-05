import localforage from 'localforage';
import React, { useCallback, useMemo, useRef } from 'react';

localforage.config({
  name: 'notifi',
});

const useNotifiJwt = (
  dappAddress: string,
  walletPublicKey: string,
  jwtPrefix: string,
): Readonly<{
  jwtRef: React.MutableRefObject<string | null>;
  setJwt: (jwt: string | null) => void;
}> => {
  const key = useMemo(
    () => `${jwtPrefix}:${dappAddress}:${walletPublicKey}`,
    [jwtPrefix, dappAddress, walletPublicKey],
  );

  const jwtRef = useRef<string | null>(null);

  React.useEffect(() => {
    const getItem = async () => {
      const value = await localforage.getItem<string>(key);
      jwtRef.current = value;
    };

    getItem().catch((_e: unknown) => {
      jwtRef.current = null;
    });
  }, [key]);

  const setJwt = useCallback(
    (jwt: string | null): void => {
      const setItem = async () => {
        await localforage.setItem(key, jwt);
      };

      jwtRef.current = jwt;
      setItem().catch((_e: unknown) => {
        /* Intentionally ignore failure to save Jwt */
      });
    },
    [jwtRef, key],
  );

  return { jwtRef, setJwt };
};

export default useNotifiJwt;
