import localforage from 'localforage';
import { useCallback, useEffect, useMemo, useState } from 'react';

localforage.config({
  name: 'notifi',
});

type Authorization = Readonly<{
  token: string;
  expiry: string;
}>;

const useNotifiJwt = (
  dappAddress: string,
  walletPublicKey: string,
  jwtPrefix: string,
): Readonly<{
  jwt: string | null;
  expiry: string | null;
  setAuthorization: (authorization: Authorization | null) => void;
}> => {
  const oldKey = useMemo(
    () => `${jwtPrefix}:${dappAddress}:${walletPublicKey}`,
    [jwtPrefix, dappAddress, walletPublicKey],
  );
  const newKey = useMemo(
    () => `${jwtPrefix}:${dappAddress}:${walletPublicKey}:authorization`,
    [jwtPrefix, dappAddress, walletPublicKey],
  );

  const [jwt, setJwtRaw] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);

  useEffect(() => {
    const getItem = async () => {
      const oldValue = await localforage.getItem<string>(oldKey);
      if (oldValue !== null) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1); // Assume not expired
        const migrated: Authorization = {
          token: oldValue,
          expiry: expiry.toISOString(),
        };

        await localforage.removeItem(oldKey);
        await localforage.setItem(newKey, migrated);
      }

      const newValue = await localforage.getItem<Authorization>(newKey);
      setJwtRaw(newValue?.token ?? null);
      setExpiry(newValue?.expiry ?? null);
    };

    getItem().catch((_e: unknown) => {
      setJwtRaw(null);
    });
  }, [oldKey, newKey, setJwtRaw]);

  const setAuthorization = useCallback(
    (authorization: Authorization | null): void => {
      const setItem = async () => {
        await localforage.setItem(newKey, authorization);
        setJwtRaw(authorization?.token ?? null);
        setExpiry(authorization?.expiry ?? null);
      };

      setItem().catch((_e: unknown) => {
        /* Intentionally ignore failure to save Jwt */
      });
    },
    [newKey, setExpiry, setJwtRaw],
  );

  return { jwt, expiry, setAuthorization };
};

export default useNotifiJwt;
