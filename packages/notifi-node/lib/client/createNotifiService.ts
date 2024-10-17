import { NotifiDataplaneClient } from '@notifi-network/notifi-dataplane';
import {
  NotifiService,
  NotifiSubscriptionService,
} from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';
import WebSocket from 'ws';

import { NotifiEnvironment, notifiConfigs } from '../utils';

export const createGraphQLClient = (env?: NotifiEnvironment): GraphQLClient => {
  if (!env) env = 'Production';
  const { gqlUrl } = notifiConfigs(env);
  const instance = new GraphQLClient(gqlUrl);

  return instance;
};

export const createNotifiSubscriptionService = (
  env?: NotifiEnvironment,
): NotifiSubscriptionService => {
  if (!env) env = 'Production';
  const { wsUrl } = notifiConfigs(env);
  return new NotifiSubscriptionService(wsUrl, WebSocket);
};

export const createDataplaneClient = (
  env?: NotifiEnvironment,
): NotifiDataplaneClient => {
  if (!env) env = 'Production';
  const { dpapiUrl } = notifiConfigs(env);
  return new NotifiDataplaneClient(dpapiUrl);
};

export const createNotifiService = (
  gqlClient: GraphQLClient,
  subService: NotifiSubscriptionService,
): NotifiService => {
  return new NotifiService(gqlClient, subService);
};
