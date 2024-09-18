import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

import { UserInteractionType } from '../types';

const envDpUrl = (env: NotifiEnvironment): string => {
  if (!env) env = 'Production';

  let url = '';
  switch (env) {
    case 'Development':
      url = 'https://dpapi.dev.notifi.network';
      break;
    case 'Local':
      url = 'https://localhost:5005';
      break;
    case 'Production':
      url = 'https://dpapi.prd.notifi.network';
      break;
    case 'Staging':
      url = 'https://dpapi.stg.notifi.network';
  }

  return url;
};

export async function sendMessageDeliveredAnalytics(
  env: NotifiEnvironment,
  encryptedBlob: string,
): Promise<Response> {
  const url = envDpUrl(env);
  return await fetch(`${url}/MessageDelivery/Delivered/${encryptedBlob}`, {
    method: 'GET',
  });
}

export async function sendUserInteractionAnalytics(
  env: NotifiEnvironment,
  action: UserInteractionType,
  encryptedBlob: string,
): Promise<Response> {
  const url = envDpUrl(env);
  return await fetch(`${url}/UserInteraction/${action}/${encryptedBlob}`, {
    method: 'GET',
  });
}
