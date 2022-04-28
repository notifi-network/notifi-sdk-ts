import localforage from 'localforage';

localforage.config({
  name: 'notifi',
});

export type Authorization = Readonly<{
  token: string;
  expiry: string;
}>;

export type StorageKey = Readonly<{
  dappAddress: string;
  jwtPrefix: string;
  walletPublicKey: string;
}>;

export type Storage = Readonly<{
  getAuthorization: () => Promise<Authorization | null>;
  setAuthorization: (authorization: Authorization) => Promise<void>;
}>;

const storage = ({
  dappAddress,
  jwtPrefix,
  walletPublicKey,
}: StorageKey): Storage => {
  const oldKey = `${jwtPrefix}:${dappAddress}:${walletPublicKey}`;
  const newKey = `${jwtPrefix}:${dappAddress}:${walletPublicKey}:authorization`;

  const getAuthorization = async () => {
    const oldValue = await localforage.getItem<string>(oldKey);
    if (oldValue !== null) {
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() - 1); // Assume expired
      const migrated: Authorization = {
        token: oldValue,
        expiry: expiry.toISOString(),
      };

      await localforage.removeItem(oldKey);
      await localforage.setItem(newKey, migrated);
    }

    return await localforage.getItem<Authorization>(newKey);
  };

  const setAuthorization = async (
    authorization: Authorization | null,
  ): Promise<void> => {
    await localforage.setItem(newKey, authorization);
  };

  return {
    getAuthorization,
    setAuthorization,
  };
};

export default storage;
