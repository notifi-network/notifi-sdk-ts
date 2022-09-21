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
