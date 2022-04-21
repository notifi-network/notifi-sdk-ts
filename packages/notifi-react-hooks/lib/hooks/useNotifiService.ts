import useNotifiConfig from './useNotifiConfig';
import { NotifiAxiosService } from '@notifi-network/notifi-axios-adapter';
import { NotifiService } from '@notifi-network/notifi-core';
import { useMemo } from 'react';

const useNotifiService = (
  env: Parameters<typeof useNotifiConfig>[0],
): NotifiService => {
  const { gqlUrl } = useNotifiConfig(env);

  const service = useMemo(() => {
    const config = {
      gqlUrl,
    };
    return new NotifiAxiosService(config);
  }, [gqlUrl]);

  return service;
};

export default useNotifiService;
