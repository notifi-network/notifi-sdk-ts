import { useCallback, useEffect, useRef } from 'react';
import useLocalStorageState from 'use-local-storage-state';

const useNotifiJwt = (
  daoAddress: string,
  walletPublicKey: string,
  jwtPrefix: string
): Readonly<{
  jwtRef: React.MutableRefObject<string | null>;
  setJwt: (jwt: string | null) => void;
}> => {
  const [storage, setStorage] = useLocalStorageState<string | null>(
    `${jwtPrefix}:${daoAddress}:${walletPublicKey}`,
    { defaultValue: null }
  );

  const jwtRef = useRef<string | null>(storage);
  useEffect(() => {
    jwtRef.current = storage;
  }, [storage]);

  const setJwt = useCallback(
    (jwt: string | null): void => {
      jwtRef.current = jwt;
      setStorage(jwt);
    },
    [jwtRef, setStorage]
  );

  return { jwtRef, setJwt };
};

export default useNotifiJwt;
