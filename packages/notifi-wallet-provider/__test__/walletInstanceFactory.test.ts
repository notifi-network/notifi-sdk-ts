import { useAllWalletHooks } from '../lib/factories/hookCreators';
import { createWallets } from '../lib/factories/walletInstanceFactory';
import {
  BinanceWallet,
  EvmWallet,
  KeplrWallet,
  LaceWallet,
  PhantomWallet,
} from '../lib/types';
import { BLOCKCHAIN_WALLETS } from '../lib/utils/walletConfigs';

// --- Helper to build a complete mock hooks object ---

type WalletHooks = ReturnType<typeof useAllWalletHooks>;

const mockFn = () => jest.fn();

const createMockHooks = (): WalletHooks => ({
  // Injected EVM wallets (5)
  metamask: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'cosmos1mm', hex: '0xmm' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://metamask.io',
  },
  okx: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'cosmos1okx', hex: '0xokx' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://www.okx.com/',
  },
  zerion: {
    isWalletInstalled: false,
    walletKeys: null,
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://zerion.io/',
  },
  rabby: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'cosmos1rabby', hex: '0xrabby' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://rabby.io/',
  },
  rainbow: {
    isWalletInstalled: false,
    walletKeys: null,
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://rainbow.me/',
  },
  // Wagmi EVM wallets (2)
  walletconnect: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'cosmos1wc', hex: '0xwc' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://walletconnect.org/',
  },
  coinbase: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'cosmos1cb', hex: '0xcb' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://www.coinbase.com/wallet',
  },
  // Special wallets
  keplr: {
    isKeplrInstalled: true,
    walletKeysKeplr: { bech32: 'cosmos1keplr', base64: 'a2VwbHI=' },
    connectKeplr: mockFn(),
    signArbitraryKeplr: mockFn(),
    disconnectKeplr: mockFn(),
    websiteURL: 'https://www.keplr.app/',
  },
  binance: {
    isWalletInstalled: true,
    walletKeys: { bech32: 'bnb1test', hex: '0xbnb' },
    connectWallet: mockFn(),
    signArbitrary: mockFn(),
    disconnectWallet: mockFn(),
    sendTransaction: mockFn(),
    websiteURL: 'https://www.binance.com/',
  },
  phantom: {
    isPhantomInstalled: true,
    walletKeysPhantom: { base58: 'PhantomKey' },
    connectPhantom: mockFn(),
    signArbitraryPhantom: mockFn(),
    disconnectPhantom: mockFn(),
    signTransactionPhantom: mockFn(),
    signHardwareTransactionPhantom: mockFn(),
    websiteURL: 'https://phantom.app/',
  },
  // Cardano wallets (6)
  lace: {
    isLaceInstalled: true,
    walletKeysLace: { bech32: 'addr1lace', cbor: 'lace_cbor' },
    connectLace: mockFn(),
    signArbitraryLace: mockFn(),
    disconnectLace: mockFn(),
    websiteURL: 'https://www.lace.io/',
  },
  eternl: {
    isEternlInstalled: true,
    walletKeysEternl: { bech32: 'addr1eternl', cbor: 'eternl_cbor' },
    connectEternl: mockFn(),
    signArbitraryEternl: mockFn(),
    disconnectEternl: mockFn(),
    websiteURL: 'https://eternl.io/',
  },
  nufi: {
    isNufiInstalled: false,
    walletKeysNufi: null,
    connectNufi: mockFn(),
    signArbitraryNufi: mockFn(),
    disconnectNufi: mockFn(),
    websiteURL: 'https://nu.fi/',
  },
  'okx-cardano': {
    isOkxCardanoInstalled: true,
    walletKeysOkxCardano: { bech32: 'addr1okxc', cbor: 'okxc_cbor' },
    connectOkxCardano: mockFn(),
    signArbitraryOkxCardano: mockFn(),
    disconnectOkxCardano: mockFn(),
    websiteURL: 'https://www.okx.com/web3',
  },
  yoroi: {
    isYoroiInstalled: true,
    walletKeysYoroi: { bech32: 'addr1yoroi', cbor: 'yoroi_cbor' },
    connectYoroi: mockFn(),
    signArbitraryYoroi: mockFn(),
    disconnectYoroi: mockFn(),
    websiteURL: 'https://yoroi-wallet.com/',
  },
  ctrl: {
    isCtrlInstalled: true,
    walletKeysCtrl: { bech32: 'addr1ctrl', cbor: 'ctrl_cbor' },
    connectCtrl: mockFn(),
    signArbitraryCtrl: mockFn(),
    disconnectCtrl: mockFn(),
    websiteURL: 'https://ctrl.xyz/',
  },
});

// --- Tests ---

describe('walletInstanceFactory — createWallets', () => {
  it('should create all 16 wallets', () => {
    const hooks = createMockHooks();
    const wallets = createWallets(hooks);

    expect(Object.keys(wallets).sort()).toEqual(Object.keys(hooks).sort());
  });

  describe('EVM wallets', () => {
    it('should create all 7 EVM wallets as EvmWallet instances', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      for (const name of BLOCKCHAIN_WALLETS.evm) {
        expect(wallets[name]).toBeInstanceOf(EvmWallet);
      }
    });

    it('should preserve isInstalled=false for uninstalled wallets', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      expect(wallets.zerion.isInstalled).toBe(false);
      expect(wallets.rainbow.isInstalled).toBe(false);
      expect(wallets.metamask.isInstalled).toBe(true);
    });
  });

  describe('Cardano wallets', () => {
    it('should create all 6 Cardano wallets as LaceWallet instances', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      for (const name of BLOCKCHAIN_WALLETS.cardano) {
        expect(wallets[name]).toBeInstanceOf(LaceWallet);
      }
    });

    it('should correctly map lace hook fields', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      expect(wallets.lace.isInstalled).toBe(true);
      expect(wallets.lace.walletKeys).toEqual({
        bech32: 'addr1lace',
        cbor: 'lace_cbor',
      });
    });
  });

  describe('Special wallets', () => {
    it('should create Keplr as KeplrWallet', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      expect(wallets.keplr).toBeInstanceOf(KeplrWallet);
      expect(wallets.keplr.isInstalled).toBe(true);
      expect(wallets.keplr.walletKeys).toEqual({
        bech32: 'cosmos1keplr',
        base64: 'a2VwbHI=',
      });
    });

    it('should create Phantom as PhantomWallet', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      expect(wallets.phantom).toBeInstanceOf(PhantomWallet);
      expect(wallets.phantom.isInstalled).toBe(true);
      expect(wallets.phantom.walletKeys).toEqual({ base58: 'PhantomKey' });
    });

    it('should create Binance as BinanceWallet', () => {
      const hooks = createMockHooks();
      const wallets = createWallets(hooks);

      expect(wallets.binance).toBeInstanceOf(BinanceWallet);
      expect(wallets.binance.isInstalled).toBe(true);
    });
  });
});
