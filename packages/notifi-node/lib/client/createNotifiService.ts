import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import { notifiConfigs } from '@notifi-network/notifi-axios-utils';
import { NotifiDataplaneClient } from '@notifi-network/notifi-dataplane';
import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

export const createGraphQLClient = (env: NotifiEnvironment): GraphQLClient => {
  const { gqlUrl } = notifiConfigs(env);
  const instance = new GraphQLClient(gqlUrl);

  return instance;
};

export const createDataplaneClient = (
  env: NotifiEnvironment,
): NotifiDataplaneClient => {
  const { dpapiUrl } = notifiConfigs(env);
  return new NotifiDataplaneClient(dpapiUrl);
};

export function createNotifiService(env: NotifiEnvironment): NotifiService;
export function createNotifiService(
  gqlClient: GraphQLClient,
  dataplaneClient?: NotifiDataplaneClient,
): NotifiService;
export function createNotifiService(
  gqlClientOrEnv: GraphQLClient | NotifiEnvironment,
  dataplaneClient?: NotifiDataplaneClient,
): NotifiService {
  if (gqlClientOrEnv instanceof GraphQLClient) {
    console.log('1', dataplaneClient);
    return new NotifiService(gqlClientOrEnv, dataplaneClient);
  } else {
    console.log('2');
    return new NotifiService(
      createGraphQLClient(gqlClientOrEnv),
      createDataplaneClient(gqlClientOrEnv),
    );
  }
}
