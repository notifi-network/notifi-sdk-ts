import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import { NOTIFI_CONFIGS } from '@notifi-network/notifi-axios-utils';
import type { AxiosRequestConfig } from 'axios';

import createAxiosInstance from './createAxiosInstance';

const envs: NotifiEnvironment[] = [
  'Production',
  'Staging',
  'Development',
  'Local',
];

describe('createAxiosInstance', () => {
  const createSpy = jest.fn();
  const axiosCreate = {
    create: createSpy,
  };

  beforeEach(() => {
    createSpy.mockReset();
  });

  envs.forEach((env: NotifiEnvironment) => {
    const config = NOTIFI_CONFIGS[env];
    describe(`${env} environment`, () => {
      it(`should point to ${env} URL`, () => {
        const expected: AxiosRequestConfig = {
          baseURL: config.gqlUrl,
        };
        createAxiosInstance(axiosCreate, env);
        expect(createSpy).toHaveBeenCalledWith(expected);
      });
    });
  });
});
