import localforage from 'localforage';

localforage.config({
  name: 'notifi',
});

export type Authorization = Readonly<{
  token: string;
  expiry: string;
}>;

export type Roles = ReadonlyArray<string>;

export type StorageKey = Readonly<{
  dappAddress: string;
  jwtPrefix: string;
  walletPublicKey: string;
}>;

export type Storage = Readonly<{
  getAuthorization: () => Promise<Authorization | null>;
  getRoles: () => Promise<Roles | null>;
  getWalletAddress: () => string | null;
  setAuthorization: (authorization: Authorization | null) => Promise<void>;
  setRoles: (roles: Roles | null) => Promise<void>;
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

  const rolesKey = `${jwtPrefix}:${dappAddress}:${walletPublicKey}:roles`;
  const getRoles = async () => {
    return await localforage.getItem<Roles>(rolesKey);
  };

  const setRoles = async (roles: Roles | null): Promise<void> => {
    await localforage.setItem(rolesKey, roles);
  };

  const getWalletAddress = () => {
    return walletPublicKey;
  };

  return {
    getAuthorization,
    getRoles,
    getWalletAddress,
    setAuthorization,
    setRoles,
  };
};

export default storage;
