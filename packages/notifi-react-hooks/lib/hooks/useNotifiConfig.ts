import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import { notifiConfigs } from '@notifi-network/notifi-axios-utils';

// TODO: Deprecate
export enum BlockchainEnvironment {
  MainNetBeta,
  TestNet,
  DevNet,
  LocalNet,
}

const useNotifiConfig = (
  env: BlockchainEnvironment | NotifiEnvironment = 'Production',
) => {
  let notifiEnv: NotifiEnvironment;
  switch (env) {
    case BlockchainEnvironment.MainNetBeta:
      notifiEnv = 'Production';
      break;
    case BlockchainEnvironment.TestNet:
      notifiEnv = 'Staging';
      break;
    case BlockchainEnvironment.DevNet:
      notifiEnv = 'Development';
      break;
    case BlockchainEnvironment.LocalNet:
      notifiEnv = 'Local';
      break;
    default:
      notifiEnv = env;
  }

  const { gqlUrl, storagePrefix } = notifiConfigs(notifiEnv);

  return {
    gqlUrl,
    storagePrefix,
  };
};

export default useNotifiConfig;
