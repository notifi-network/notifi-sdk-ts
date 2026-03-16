import {
  createBinanceWallet,
  createEvmWallet,
  createKeplrWallet,
  createLaceWallet,
  createPhantomWallet,
} from '../lib/factories/walletCreators';
import {
  BinanceWallet,
  EvmWallet,
  KeplrWallet,
  LaceWallet,
  PhantomWallet,
} from '../lib/types';

// --- Mock hook factories ---

const mockFn = () => jest.fn();

const createMockInjectedHook = () => ({
  isWalletInstalled: true,
  walletKeys: { bech32: 'cosmos1test', hex: '0xtest' },
  connectWallet: mockFn(),
  signArbitrary: mockFn(),
  disconnectWallet: mockFn(),
  sendTransaction: mockFn(),
  websiteURL: 'https://metamask.io',
});

const createMockWagmiHook = () => ({
  isWalletInstalled: true,
  walletKeys: { bech32: 'cosmos1wagmi', hex: '0xwagmi' },
  connectWallet: mockFn(),
  signArbitrary: mockFn(),
  disconnectWallet: mockFn(),
  sendTransaction: mockFn(),
  websiteURL: 'https://walletconnect.org',
});

const createMockBinanceHook = () => ({
  isWalletInstalled: true,
  walletKeys: { bech32: 'bnb1test', hex: '0xbnb' },
  connectWallet: mockFn(),
  signArbitrary: mockFn(),
  disconnectWallet: mockFn(),
  sendTransaction: mockFn(),
  websiteURL: 'https://www.binance.com/en/wallet-direct',
});

const createMockKeplrHook = () => ({
  isKeplrInstalled: true,
  walletKeysKeplr: { bech32: 'cosmos1keplr', base64: 'a2VwbHI=' },
  connectKeplr: mockFn(),
  signArbitraryKeplr: mockFn(),
  disconnectKeplr: mockFn(),
  websiteURL: 'https://www.keplr.app/',
});

const createMockPhantomHook = () => ({
  isPhantomInstalled: true,
  walletKeysPhantom: { base58: 'PhantomBase58Key' },
  connectPhantom: mockFn(),
  signArbitraryPhantom: mockFn(),
  disconnectPhantom: mockFn(),
  signTransactionPhantom: mockFn(),
  signHardwareTransactionPhantom: mockFn(),
  websiteURL: 'https://phantom.app/',
});

const createMockLaceHook = () => ({
  isLaceInstalled: true,
  walletKeysLace: { bech32: 'addr1lace', cbor: 'lace_cbor' },
  connectLace: mockFn(),
  signArbitraryLace: mockFn(),
  disconnectLace: mockFn(),
  websiteURL: 'https://www.lace.io/',
});

// --- Tests ---

describe('walletCreators', () => {
  describe('createEvmWallet', () => {
    it('should create EvmWallet from injected hook', () => {
      const hook = createMockInjectedHook();
      const wallet = createEvmWallet(hook);

      expect(wallet).toBeInstanceOf(EvmWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({
        bech32: 'cosmos1test',
        hex: '0xtest',
      });
      expect(wallet.signArbitrary).toBe(hook.signArbitrary);
      expect(wallet.connect).toBe(hook.connectWallet);
      expect(wallet.disconnect).toBe(hook.disconnectWallet);
      expect(wallet.sendTransaction).toBe(hook.sendTransaction);
      expect(wallet.websiteURL).toBe('https://metamask.io');
    });

    it('should create EvmWallet from wagmi hook', () => {
      const hook = createMockWagmiHook();
      const wallet = createEvmWallet(hook);

      expect(wallet).toBeInstanceOf(EvmWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({
        bech32: 'cosmos1wagmi',
        hex: '0xwagmi',
      });
    });
  });

  describe('createBinanceWallet', () => {
    it('should create BinanceWallet from hook', () => {
      const hook = createMockBinanceHook();
      const wallet = createBinanceWallet(hook);

      expect(wallet).toBeInstanceOf(BinanceWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({ bech32: 'bnb1test', hex: '0xbnb' });
      expect(wallet.signArbitrary).toBe(hook.signArbitrary);
      expect(wallet.connect).toBe(hook.connectWallet);
      expect(wallet.disconnect).toBe(hook.disconnectWallet);
      expect(wallet.sendTransaction).toBe(hook.sendTransaction);
    });
  });

  describe('createKeplrWallet', () => {
    it('should create KeplrWallet from hook', () => {
      const hook = createMockKeplrHook();
      const wallet = createKeplrWallet(hook);

      expect(wallet).toBeInstanceOf(KeplrWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({
        bech32: 'cosmos1keplr',
        base64: 'a2VwbHI=',
      });
      expect(wallet.signArbitrary).toBe(hook.signArbitraryKeplr);
      expect(wallet.connect).toBe(hook.connectKeplr);
      expect(wallet.disconnect).toBe(hook.disconnectKeplr);
    });
  });

  describe('createPhantomWallet', () => {
    it('should create PhantomWallet from hook', () => {
      const hook = createMockPhantomHook();
      const wallet = createPhantomWallet(hook);

      expect(wallet).toBeInstanceOf(PhantomWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({ base58: 'PhantomBase58Key' });
      expect(wallet.signArbitrary).toBe(hook.signArbitraryPhantom);
      expect(wallet.connect).toBe(hook.connectPhantom);
      expect(wallet.disconnect).toBe(hook.disconnectPhantom);
      expect(wallet.signTransaction).toBe(hook.signTransactionPhantom);
      expect(wallet.signHardwareTransaction).toBe(
        hook.signHardwareTransactionPhantom,
      );
    });
  });

  describe('createLaceWallet', () => {
    it('should create LaceWallet from hook', () => {
      const hook = createMockLaceHook();
      const wallet = createLaceWallet(hook);

      expect(wallet).toBeInstanceOf(LaceWallet);
      expect(wallet.isInstalled).toBe(true);
      expect(wallet.walletKeys).toEqual({
        bech32: 'addr1lace',
        cbor: 'lace_cbor',
      });
      expect(wallet.signArbitrary).toBe(hook.signArbitraryLace);
      expect(wallet.connect).toBe(hook.connectLace);
      expect(wallet.disconnect).toBe(hook.disconnectLace);
    });
  });
});
