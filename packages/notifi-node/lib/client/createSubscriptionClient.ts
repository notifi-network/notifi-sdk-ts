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
  class AuthorizedSocket extends WebSocket {
    constructor(address: string, protocols?: string | string[]) {
      super(address, protocols, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    }
  }

  const { wsUrl } = notifiConfigs(env);
  const client = new SubscriptionClient(
    wsUrl,
    {
      reconnect: true,
      reconnectionAttempts: 5,
    },
    AuthorizedSocket,
  );

  return client;
};
