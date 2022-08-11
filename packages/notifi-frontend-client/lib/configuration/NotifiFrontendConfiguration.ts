export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiFrontendConfiguration = Readonly<{
  dappAddress: string;
  env: NotifiEnvironment;
  walletPublicKey: string;
}>;
