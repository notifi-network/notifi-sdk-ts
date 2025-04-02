export type NotifiEnvironment =
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Local';

export const envUrl = (
  env?: NotifiEnvironment,
  endpointType?: 'websocket' | 'http',
): string => {
  if (!env) env = 'Production';

  let url = '';
  switch (env) {
    case 'Development':
      url = '://api.dev.notifi.network/gql';
      break;
    case 'Local':
      url = '://localhost:5001/gql';
      break;
    case 'Production':
      url = '://api.notifi.network/gql';
      break;
    case 'Staging':
      url = '://api.stg.notifi.network/gql';
  }

  return `${endpointType === 'websocket' ? 'wss' : env === 'Local' ? 'http' : 'https'}${url}`;
};
