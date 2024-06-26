import { Types } from '@notifi-network/notifi-graphql';

export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiEnvironmentConfiguration = Readonly<{
  env?: NotifiEnvironment;
  tenantId: string;
  storageOption?: Readonly<{
    driverType?: 'LocalForage' | 'InMemory';
  }>;
}>;

type WalletBlockchainWithPublicKey = Extract<
  Types.WalletBlockchain,
  | 'ETHEREUM'
  | 'POLYGON'
  | 'ARBITRUM'
  | 'AVALANCHE'
  | 'BINANCE'
  | 'OPTIMISM'
  | 'SOLANA'
  | 'ZKSYNC'
  | 'BASE'
  | 'BLAST'
  | 'CELO'
  | 'MANTLE'
  | 'LINEA'
  | 'SCROLL'
  | 'MANTA'
  | 'MONAD'
  | 'BERACHAIN'
  | 'EVMOS'
  | 'THE_ROOT_NETWORK'
>;

type WalletBlockchainWithDelegate = 'XION';

type WalletBlockchainWithPublicKeyAndAddress = Exclude<
  Types.WalletBlockchain,
  WalletBlockchainWithPublicKey | 'OFF_CHAIN' | WalletBlockchainWithDelegate
>;

export type NotifiConfigWithPublicKey = Readonly<{
  walletBlockchain: WalletBlockchainWithPublicKey;
  walletPublicKey: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithPublicKeyAndAddress = Readonly<{
  walletBlockchain: WalletBlockchainWithPublicKeyAndAddress;
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithDelegate = Readonly<{
  walletBlockchain: WalletBlockchainWithDelegate;
  delegatedAddress: string;
  delegatedPublicKey: string;
  delegatorAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiFrontendConfiguration =
  | NotifiConfigWithPublicKey
  | NotifiConfigWithPublicKeyAndAddress
  | NotifiConfigWithDelegate;

export type ConfigFactoryInput =
  | ConfigFactoryInputPublicKeyAndAddress
  | ConfigFactoryInputPublicKey
  | ConfigFactoryInputDelegated;

export const checkIsConfigWithPublicKeyAndAddress = (
  config: NotifiFrontendConfiguration,
): config is NotifiConfigWithPublicKeyAndAddress => {
  return 'accountAddress' in config;
};

export const checkIsConfigWithDelegate = (
  config: NotifiFrontendConfiguration,
): config is NotifiConfigWithDelegate => {
  return 'delegatedAddress' in config;
};

export type ConfigFactoryInputDelegated = {
  account: Readonly<{
    address: string;
    publicKey: string;
    delegatorAddress: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: WalletBlockchainWithDelegate;
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type ConfigFactoryInputPublicKeyAndAddress = {
  account: Readonly<{
    address: string;
    publicKey: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKeyAndAddress['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type ConfigFactoryInputPublicKey = {
  account: Readonly<{
    publicKey: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKey['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type FrontendClientConfigFactory<T extends NotifiFrontendConfiguration> =
  (
    args: T extends NotifiConfigWithPublicKeyAndAddress
      ? ConfigFactoryInputPublicKeyAndAddress
      : T extends NotifiConfigWithDelegate
      ? ConfigFactoryInputDelegated
      : ConfigFactoryInputPublicKey,
  ) => NotifiFrontendConfiguration;

const evmChains = [
  'ETHEREUM',
  'POLYGON',
  'ARBITRUM',
  'AVALANCHE',
  'BINANCE',
  'OPTIMISM',
  'THE_ROOT_NETWORK',
  'BASE',
  'BLAST',
  'CELO',
  'MANTLE',
  'LINEA',
  'SCROLL',
  'MANTA',
  'MONAD',
  'ZKSYNC',
  'BERACHAIN',
] as const;

type EVMChains = Extract<Types.WalletBlockchain, (typeof evmChains)[number]>;

const isEvmChain = (chain: Types.WalletBlockchain): chain is EVMChains => {
  return !!evmChains.find((c) => c === chain);
};

const configFactoryPublicKey: FrontendClientConfigFactory<
  NotifiConfigWithPublicKey
> = (args) => {
  let walletPublicKey = args.account.publicKey;
  if (isEvmChain(args.walletBlockchain)) {
    walletPublicKey = walletPublicKey.toLowerCase();
  }
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    walletPublicKey,
    storageOption: args.storageOption,
  };
};

const configFactoryPublicKeyAndAddress: FrontendClientConfigFactory<
  NotifiConfigWithPublicKeyAndAddress
> = (args) => {
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    authenticationKey: args.account.publicKey,
    accountAddress: args.account.address,
    storageOption: args.storageOption,
  };
};

const configFactoryDelegated: FrontendClientConfigFactory<
  NotifiConfigWithDelegate
> = (args) => {
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    delegatedAddress: args.account.address,
    delegatedPublicKey: args.account.publicKey,
    delegatorAddress: args.account.delegatorAddress,
    storageOption: args.storageOption,
  };
};

const isWithPubkeyAndAddress = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputPublicKeyAndAddress => {
  return 'address' in config.account && !isWithDelegate(config);
};

const isWithDelegate = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputDelegated => {
  return 'delegatorAddress' in config.account;
};

export const newFrontendConfig = (
  config: ConfigFactoryInput,
): NotifiFrontendConfiguration => {
  if (isWithDelegate(config)) {
    return configFactoryDelegated(config);
  } else if (isWithPubkeyAndAddress(config)) {
    return configFactoryPublicKeyAndAddress(config);
  } else {
    return configFactoryPublicKey(config);
  }
};

export const envUrl = (
  env?: NotifiEnvironment,
  endpointType?: 'websocket' | 'http',
): string => {
  if (!env) env = 'Production';

  let url = '';
  switch (env) {
    case 'Development':
      url = '://api.dev.notifi.network/gql';
      break;
    case 'Local':
      url = '://localhost:5001/gql';
      break;
    case 'Production':
      url = '://api.notifi.network/gql';
      break;
    case 'Staging':
      url = '://api.stg.notifi.network/gql';
  }

  return `${endpointType === 'websocket' ? 'wss' : 'https'}${url}`;
};
