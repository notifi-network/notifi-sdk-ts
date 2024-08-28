export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type EnvironmentConfig = Readonly<{
  gqlUrl: string;
  storagePrefix: string;
  wsUrl: string;
  dpapiUrl: string;
}>;

export const NOTIFI_CONFIGS: Record<NotifiEnvironment, EnvironmentConfig> = {
  Production: {
    gqlUrl: 'https://api.notifi.network/gql',
    storagePrefix: 'notifi-jwt',
    wsUrl: 'wss://api.notifi.network/gql',
    dpapiUrl: 'https://dpapi.prd.notifi.network',
  },
  Staging: {
    gqlUrl: 'https://api.stg.notifi.network/gql',
    storagePrefix: 'notifi-jwt:stg',
    wsUrl: 'wss://api.stg.notifi.network/gql',
    dpapiUrl: 'https://dpapi.stg.notifi.network',
  },
  Development: {
    gqlUrl: 'https://api.dev.notifi.network/gql',
    storagePrefix: 'notifi-jwt:dev',
    wsUrl: 'wss://api.dev.notifi.network/gql',
    dpapiUrl: 'https://dpapi.dev.notifi.network',
  },
  Local: {
    gqlUrl: 'https://localhost:5001/gql',
    storagePrefix: 'notifi-jwt:local',
    wsUrl: 'wss://localhost:5001/gql',
    dpapiUrl: 'http://localhost:5005',
  },
};

export const notifiConfigs = (
  environment?: NotifiEnvironment,
): EnvironmentConfig => {
  if (!environment) environment = 'Production';
  return NOTIFI_CONFIGS[environment];
};
