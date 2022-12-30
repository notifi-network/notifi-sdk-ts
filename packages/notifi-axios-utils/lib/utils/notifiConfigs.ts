export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type EnvironmentConfig = Readonly<{
  gqlUrl: string;
  storagePrefix: string;
  wsUrl: string;
}>;

export const NOTIFI_CONFIGS: Record<NotifiEnvironment, EnvironmentConfig> = {
  Production: {
    gqlUrl: 'https://api.notifi.network/gql',
    storagePrefix: 'notifi-jwt',
    wsUrl: 'wss://api.notifi.network/gql',
  },
  Staging: {
    gqlUrl: 'https://api.stg.notifi.network/gql',
    storagePrefix: 'notifi-jwt:stg',
    wsUrl: 'wss://api.stg.notifi.network/gql',
  },
  Development: {
    gqlUrl: 'https://api.dev.notifi.network/gql',
    storagePrefix: 'notifi-jwt:dev',
    wsUrl: 'wss://api.dev.notifi.network/gql',
  },
  Local: {
    gqlUrl: 'https://localhost:5001/gql',
    storagePrefix: 'notifi-jwt:local',
    wsUrl: 'wss://localhost:5001/gql',
  },
};

const notifiConfigs = (environment: NotifiEnvironment): EnvironmentConfig => {
  return NOTIFI_CONFIGS[environment];
};

export default notifiConfigs;
