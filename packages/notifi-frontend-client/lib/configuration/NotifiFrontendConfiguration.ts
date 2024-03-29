import { Types } from '@notifi-network/notifi-graphql';

export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiEnvironmentConfiguration = Readonly<{
  env: NotifiEnvironment;
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
>;

type WalletBlockchainWithDelegate = 'XION'

type WalletBlockchainWithPublicKeyAndAddress = Exclude<
  Types.WalletBlockchain,
  WalletBlockchainWithPublicKey | 'OFF_CHAIN' | 'EVMOS'
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
}

export type ConfigFactoryInputDelegated = {
  account: Readonly<{
    address: string;
    publicKey: string;
    delegatorAddress: string;
  }>;
  tenantId: string;
  env: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKeyAndAddress['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type ConfigFactoryInputPublicKeyAndAddress = {
  account: Readonly<{
    address: string;
    publicKey: string;
  }>;
  tenantId: string;
  env: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKeyAndAddress['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type ConfigFactoryInputPublicKey = {
  account: Readonly<{
    publicKey: string;
  }>;
  tenantId: string;
  env: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKey['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

export type FrontendClientConfigFactory<T extends NotifiFrontendConfiguration> =
  (
    args: T extends NotifiConfigWithPublicKeyAndAddress
      ? ConfigFactoryInputPublicKeyAndAddress
      : ConfigFactoryInputPublicKey,
  ) => NotifiFrontendConfiguration;

const evmChains = [
  'ETHEREUM',
  'POLYGON',
  'ARBITRUM',
  'AVALANCHE',
  'BINANCE',
  'OPTIMISM',
  'BASE',
  'BLAST',
  'CELO',
  'MANTLE',
  'LINEA',
  'SCROLL',
  'MANTA',
  'MONAD',
  'ZKSYNC',
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

const validateConfigInput = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputPublicKeyAndAddress => {
  return 'address' in config.account;
};

export const newFrontendConfig = (
  config: ConfigFactoryInput,
): NotifiFrontendConfiguration => {
  return validateConfigInput(config)
    ? configFactoryPublicKeyAndAddress(config)
    : configFactoryPublicKey(config);
};

export const envUrl = (env: NotifiEnvironment): string => {
  switch (env) {
    case 'Development':
      return 'https://api.dev.notifi.network/gql';
    case 'Local':
      return 'https://localhost:5001/gql';
    case 'Production':
      return 'https://api.notifi.network/gql';
    case 'Staging':
      return 'https://api.stg.notifi.network/gql';
  }
};
