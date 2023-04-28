export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type NotifiEnvironmentConfiguration = Readonly<{
  env: NotifiEnvironment;
  tenantId: string;
}>;

export type NotifiConfigWithPublicKey = Readonly<{
  walletBlockchain:
    | 'ETHEREUM'
    | 'POLYGON'
    | 'ARBITRUM'
    | 'AVALANCHE'
    | 'BINANCE'
    | 'OPTIMISM'
    | 'SOLANA';
  walletPublicKey: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithPublicKeyAndAddress = Readonly<{
  walletBlockchain: 'SUI' | 'NEAR' | 'INJECTIVE' | 'APTOS' | 'ACALA';
  authenticationKey: string;
  accountAddress: string;
}> &
  NotifiEnvironmentConfiguration;

export type NotifiFrontendConfiguration =
  | NotifiConfigWithPublicKey
  | NotifiConfigWithPublicKeyAndAddress;

export type FrontendClientConfigFactory = (args: {
  account: Readonly<{
    address?: string;
    publicKey: string;
  }>;
  tenantId: string;
  env: NotifiEnvironment;
  walletBlockchain: NotifiFrontendConfiguration['walletBlockchain'];
}) => NotifiFrontendConfiguration;

export const newFrontendConfig: FrontendClientConfigFactory = (args) => {
  switch (args.walletBlockchain) {
    // Chains with only publicKey in account argument
    case 'ETHEREUM':
    case 'POLYGON':
    case 'ARBITRUM':
    case 'AVALANCHE':
    case 'BINANCE':
    case 'OPTIMISM':
    case 'SOLANA':
      return {
        tenantId: args.tenantId,
        env: args.env,
        walletBlockchain: args.walletBlockchain,
        walletPublicKey: args.account.publicKey,
      };
    // Chains with publicKey and address in account arguments
    case 'SUI':
    case 'NEAR':
    case 'INJECTIVE':
    case 'APTOS':
    case 'ACALA':
      return {
        tenantId: args.tenantId,
        env: args.env,
        walletBlockchain: args.walletBlockchain,
        authenticationKey: args.account.publicKey,
        accountAddress: args.account.publicKey,
      };
  }
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
