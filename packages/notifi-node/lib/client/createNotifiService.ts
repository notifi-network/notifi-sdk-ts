import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import { notifiConfigs } from '@notifi-network/notifi-axios-utils';
import { GraphQLClient } from 'graphql-request';

export const createGraphQLClient = (env: NotifiEnvironment): GraphQLClient => {
  const { gqlUrl } = notifiConfigs(env);
  const instance = new GraphQLClient(gqlUrl);

  return instance;
};
