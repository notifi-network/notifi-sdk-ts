import useNotifiConfig, { BlockchainEnvironment } from './useNotifiConfig';
import { NotifiAxiosService } from '@notifi-network/notifi-axios-adapter';
import { NotifiService } from '@notifi-network/notifi-core';
import { MutableRefObject, useMemo } from 'react';

const useNotifiService = (
  env = BlockchainEnvironment.MainNetBeta,
  jwtRef: MutableRefObject<string | null>,
): NotifiService => {
  const { gqlUrl } = useNotifiConfig(env);

  const service = useMemo(() => {
    const config = {
      gqlUrl,
      jwtContainer: jwtRef,
    };
    return new NotifiAxiosService(config);
  }, [gqlUrl, jwtRef]);

  return service;
};

export default useNotifiService;
