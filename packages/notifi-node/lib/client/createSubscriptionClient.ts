import {
  NotifiEnvironment,
  notifiConfigs,
} from '@notifi-network/notifi-axios-utils';
import { createClient } from 'graphql-ws';
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
  const client = createClient({
    url: wsUrl,
    webSocketImpl: AuthorizedSocket,
  });

  return client;
};
