import type {
  AxiosCreate,
  NotifiEnvironment,
} from '@notifi-network/notifi-axios-utils';
import { notifiConfigs } from '@notifi-network/notifi-axios-utils';
import type { AxiosInstance } from 'axios';

const createAxiosInstance = (
  axiosCreate: AxiosCreate,
  env: NotifiEnvironment,
): AxiosInstance => {
  const { gqlUrl } = notifiConfigs(env);
  const instance = axiosCreate.create({
    baseURL: gqlUrl,
  });

  return instance;
};

export default createAxiosInstance;
