import {
  cleanWalletsInLocalStorage,
  getWalletsFromLocalStorage,
  setWalletKeysToLocalStorage,
} from '../lib/utils/localStorageUtils';

const STORAGE_KEY = 'NotifiWalletStorage';

// Mock localStorage for Node test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((_index: number) => null),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', {
  value: { localStorage: localStorageMock },
  writable: true,
});

describe('localStorageUtils', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('setWalletKeysToLocalStorage', () => {
    it('should store metamask wallet keys correctly', () => {
      const keys = { bech32: 'cosmos1abc', hex: '0xabc123' };
      setWalletKeysToLocalStorage('metamask', keys);

      const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({
        walletName: 'metamask',
        walletKeys: keys,
      });
    });

    it('should store keplr wallet keys correctly', () => {
      const keys = { bech32: 'cosmos1xyz', base64: 'c29tZWJhc2U2NA==' };
      setWalletKeysToLocalStorage('keplr', keys);

      const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({
        walletName: 'keplr',
        walletKeys: keys,
      });
    });

    it('should store phantom wallet keys correctly', () => {
      const keys = { base58: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' };
      setWalletKeysToLocalStorage('phantom', keys);

      const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({
        walletName: 'phantom',
        walletKeys: keys,
      });
    });

    it('should store lace (cardano) wallet keys correctly', () => {
      const keys = { bech32: 'addr1qxyz', cbor: '82d818584283581c' };
      setWalletKeysToLocalStorage('lace', keys);

      const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({
        walletName: 'lace',
        walletKeys: keys,
      });
    });

    it('should overwrite previous value when called again', () => {
      const keys1 = { bech32: 'cosmos1first', hex: '0x111' };
      const keys2 = { bech32: 'cosmos1second', hex: '0x222' };
      setWalletKeysToLocalStorage('metamask', keys1);
      setWalletKeysToLocalStorage('metamask', keys2);

      const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
      expect(stored.walletKeys).toEqual(keys2);
    });
  });

  describe('cleanWalletsInLocalStorage', () => {
    it('should remove the wallet storage key', () => {
      localStorageMock.setItem(
        STORAGE_KEY,
        JSON.stringify({ walletName: 'metamask' }),
      );
      cleanWalletsInLocalStorage();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should not throw when storage is already empty', () => {
      expect(() => cleanWalletsInLocalStorage()).not.toThrow();
    });
  });

  describe('getWalletsFromLocalStorage', () => {
    it('should return stored wallet when valid data exists', () => {
      const data = {
        walletName: 'metamask',
        walletKeys: { bech32: 'cosmos1abc', hex: '0xabc' },
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(data));

      const result = getWalletsFromLocalStorage();
      expect(result).toEqual(data);
    });

    it('should return null when localStorage has no stored wallet (key absent)', () => {
      // localStorage.getItem returns null → fallback to '{}'
      const result = getWalletsFromLocalStorage();
      expect(result).toBeNull();
    });

    it('should return null when stored data is an empty object', () => {
      localStorageMock.setItem(STORAGE_KEY, '{}');
      const result = getWalletsFromLocalStorage();
      expect(result).toBeNull();
    });

    it('should return null when stored data has no walletName property', () => {
      localStorageMock.setItem(
        STORAGE_KEY,
        JSON.stringify({ someOtherKey: 'value' }),
      );
      const result = getWalletsFromLocalStorage();
      expect(result).toBeNull();
    });

    it('should return null when localStorage contains malformed JSON', () => {
      localStorageMock.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const result = getWalletsFromLocalStorage();
      expect(result).toBeNull();
    });

    it('should correctly handle wallet data with all key types', () => {
      const data = {
        walletName: 'keplr',
        walletKeys: { bech32: 'cosmos1test', base64: 'dGVzdA==' },
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(data));

      const result = getWalletsFromLocalStorage();
      expect(result).toEqual(data);
      expect(result!.walletName).toBe('keplr');
    });
  });
});
