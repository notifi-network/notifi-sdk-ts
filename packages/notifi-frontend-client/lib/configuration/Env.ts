export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export const envUrl = (
  env?: NotifiEnvironment,
  endpointType?: 'websocket' | 'http',
  endpoint?: 'notifi-graphql' | 'notifi-dataplane',
): string => {
  if (!env) env = 'Production';

  let url = '';
  switch (env) {
    case 'Development':
      url =
        endpoint === 'notifi-dataplane'
          ? '://dpapi.dev.notifi.network'
          : '://api.dev.notifi.network/gql';
      break;
    case 'Local':
      url =
        endpoint === 'notifi-dataplane'
          ? '://localhost:5005'
          : '://localhost:5001/gql';
      break;
    case 'Production':
      url =
        endpoint === 'notifi-dataplane'
          ? '://dpapi.prd.notifi.network'
          : '://api.notifi.network/gql';
      break;
    case 'Staging':
      url =
        endpoint === 'notifi-dataplane'
          ? '://dpapi.stg.notifi.network'
          : '://api.stg.notifi.network/gql';
  }

  return `${endpointType === 'websocket' ? 'wss' : env === 'Local' ? 'http' : 'https'}${url}`;
};
