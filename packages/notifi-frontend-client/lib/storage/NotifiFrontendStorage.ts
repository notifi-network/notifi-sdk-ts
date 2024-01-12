export type StorageDriver = Readonly<{
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, newValue: T | null) => Promise<void>;
  has: (key: string) => Promise<boolean>;
}>;

export type GetStorageType<Key extends string, T> = Readonly<{
  [key in `get${Capitalize<Key>}`]: () => Promise<T | null>;
}>;

export type SetStorageType<Key extends string, T> = Readonly<{
  [key in `set${Capitalize<Key>}`]: (newValue: T | null) => Promise<void>;
}>;

export type HasStorageType<Key extends string> = Readonly<{
  [key in `has${Capitalize<Key>}`]: () => Promise<boolean>;
}>;

export type StorageType<Key extends string, T> = GetStorageType<Key, T> &
  SetStorageType<Key, T> &
  HasStorageType<Key>;

export type Authorization = Readonly<{
  token: string;
  expiry: string;
}>;

export type AuthorizationStorage = StorageType<'authorization', Authorization>;

export type Roles = ReadonlyArray<string>;
export type RolesStorage = StorageType<'roles', Roles>;

const KEY_AUTHORIZATION = 'authorization';
const KEY_ROLES = 'roles';

export type NotifiStorage = AuthorizationStorage & RolesStorage;

export class NotifiFrontendStorage implements NotifiStorage {
  constructor(private _driver: StorageDriver) {}

  getAuthorization(): Promise<Authorization | null> {
    return this._driver.get(KEY_AUTHORIZATION);
  }

  setAuthorization(newValue: Authorization | null): Promise<void> {
    return this._driver.set(KEY_AUTHORIZATION, newValue);
  }

  hasAuthorization(): Promise<boolean> {
    return this._driver.has(KEY_AUTHORIZATION);
  }

  getRoles(): Promise<Roles | null> {
    return this._driver.get(KEY_ROLES);
  }

  setRoles(newValue: Roles | null): Promise<void> {
    return this._driver.set(KEY_ROLES, newValue);
  }

  hasRoles(): Promise<boolean> {
    return this._driver.has(KEY_ROLES);
  }
}
