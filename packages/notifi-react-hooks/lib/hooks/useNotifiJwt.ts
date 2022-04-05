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
    (async () => {
      const value = await localforage.getItem<string>(key);
      jwtRef.current = value;
    })();
  }, [key]);

  const setJwt = useCallback(
    async (jwt: string | null): Promise<void> => {
      jwtRef.current = jwt;
      await localforage.setItem(key, jwt);
    },
    [jwtRef, key],
  );

  return { jwtRef, setJwt };
};

export default useNotifiJwt;
