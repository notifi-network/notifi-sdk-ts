export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiEnvironmentConfiguration = Readonly<{
  env: NotifiEnvironment;
  tenantId: string;
}>;

export type NotifiSolanaConfiguration = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiAptosConfiguration = Readonly<{
  walletBlockchain: 'APTOS';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiFrontendConfiguration =
  | NotifiSolanaConfiguration
  | NotifiAptosConfiguration;

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
