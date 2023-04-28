export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiEnvironmentConfiguration = Readonly<{
  env: NotifiEnvironment;
  tenantId: string;
}>;

export type NotifiAptosConfiguration = Readonly<{
  walletBlockchain: 'APTOS';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiFrontendConfiguration =
  | NotifiSolanaConfiguration
  | NotifiAptosConfiguration
  | NotifiEvmConfiguration
  | NotifiSuiConfiguration
  | NotifiAcalaConfiguration
  | NotifiNearConfiguration;

export type NotifiAcalaConfiguration = Readonly<{
  walletBlockchain: 'ACALA';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export const newAcalaConfig = (
  account: Readonly<{
    address: string;
    publicKey: string;
  }>,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiAcalaConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain: 'ACALA',
    authenticationKey: account.publicKey,
    accountAddress: account.address,
  };
};

export const newAptosConfig = (
  account: Readonly<{
    address: string;
    publicKey: string;
  }>,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiAptosConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain: 'APTOS',
    authenticationKey: account.publicKey,
    accountAddress: account.address,
  };
};

export type NotifiNearConfiguration = Readonly<{
  walletBlockchain: 'NEAR';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export const newNearConfig = (
  account: Readonly<{
    address: string;
    publicKey: string;
  }>,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiNearConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain: 'NEAR',
    authenticationKey: account.publicKey,
    accountAddress: account.address,
  };
};

export type NotifiSolanaConfiguration = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
}> &
  NotifiEnvironmentConfiguration;

export const newSolanaConfig = (
  walletPublicKey: string,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiSolanaConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain: 'SOLANA',
    walletPublicKey: walletPublicKey,
  };
};

export type NotifiSuiConfiguration = Readonly<{
  walletBlockchain: 'SUI';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export const newSuiConfig = (
  account: Readonly<{
    address: string;
    publicKey: string; // The same as accountAddress
  }>,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiSuiConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain: 'SUI',
    authenticationKey: account.publicKey,
    accountAddress: account.address,
  };
};

export type NotifiEvmConfiguration = Readonly<{
  walletBlockchain:
    | 'ETHEREUM'
    | 'POLYGON'
    | 'ARBITRUM'
    | 'AVALANCHE'
    | 'BINANCE'
    | 'OPTIMISM';
  walletPublicKey: string;
}> &
  NotifiEnvironmentConfiguration;

export const newEvmConfig = (
  walletBlockchain: NotifiEvmConfiguration['walletBlockchain'],
  walletPublicKey: string,
  tenantId: string,
  env: NotifiEnvironment | undefined = 'Development',
): NotifiEvmConfiguration => {
  return {
    tenantId,
    env,
    walletBlockchain,
    walletPublicKey: walletPublicKey,
  };
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
