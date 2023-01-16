import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import { notifiConfigs } from '@notifi-network/notifi-axios-utils';
import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

export const createGraphQLClient = (env: NotifiEnvironment): GraphQLClient => {
  const { gqlUrl } = notifiConfigs(env);
  const instance = new GraphQLClient(gqlUrl);

  return instance;
};

export const createNotifiService = (
  gqlClient: GraphQLClient,
): NotifiService => {
  return new NotifiService(gqlClient);
};
