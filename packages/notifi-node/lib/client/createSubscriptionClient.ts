import {
  NotifiEnvironment,
  notifiConfigs,
} from '@notifi-network/notifi-axios-utils';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import WebSocket from 'ws';

export function createSubscriptionClient(jwt: string): SubscriptionClient;
export function createSubscriptionClient(
  env: NotifiEnvironment,
  jwt: string,
): SubscriptionClient;
export function createSubscriptionClient(
  param1: NotifiEnvironment | string,
  param2?: string,
): SubscriptionClient {
  let env: NotifiEnvironment;
  let jwt: string;
  if (param2) {
    env = param1 as NotifiEnvironment;
    jwt = param2;
  } else {
    env = 'Production';
    jwt = param1;
  }
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
}