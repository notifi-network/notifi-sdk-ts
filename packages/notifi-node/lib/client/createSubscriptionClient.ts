import {
  NotifiEnvironment,
  notifiConfigs,
} from '@notifi-network/notifi-axios-utils';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import WebSocket from 'ws';

export const createSubscriptionClient = (
  env: NotifiEnvironment,
  jwt: string,
) => {
  const { wsUrl } = notifiConfigs(env);
  const client = new SubscriptionClient(
    wsUrl,
    {
      connectionParams: {
        Authorization: `Bearer ${jwt}`,
      },
      reconnect: true,
      reconnectionAttempts: 5,
    },
    WebSocket,
  );

  return client;
};
