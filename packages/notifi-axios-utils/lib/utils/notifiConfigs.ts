export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export type EnvironmentConfig = Readonly<{
  gqlUrl: string;
  storagePrefix: string;
}>;

export const NOTIFI_CONFIGS: Record<NotifiEnvironment, EnvironmentConfig> = {
  Production: {
    gqlUrl: 'https://api.notifi.network/gql',
    storagePrefix: 'notifi-jwt',
  },
  Staging: {
    gqlUrl: 'https://api.stg.notifi.network/gql',
    storagePrefix: 'notifi-jwt:stg',
  },
  Development: {
    gqlUrl: 'https://api.dev.notifi.network/gql',
    storagePrefix: 'notifi-jwt:dev',
  },
  Local: {
    gqlUrl: 'https://localhost:5001/gql',
    storagePrefix: 'notifi-jwt:local',
  },
};

const notifiConfigs = (environment: NotifiEnvironment): EnvironmentConfig => {
  return NOTIFI_CONFIGS[environment];
};

export default notifiConfigs;
