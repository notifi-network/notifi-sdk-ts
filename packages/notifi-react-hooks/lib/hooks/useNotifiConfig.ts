export enum BlockchainEnvironment {
  MainNetBeta,
  TestNet,
  DevNet,
  LocalNet,
}

const useNotifiConfig = (env = BlockchainEnvironment.MainNetBeta) => {
  let gqlUrl = '';
  let storagePrefix = '';
  switch (env) {
    case BlockchainEnvironment.MainNetBeta:
      gqlUrl = 'https://api.notifi.network/gql';
      storagePrefix = 'notifi-jwt';
      break;
    case BlockchainEnvironment.TestNet:
      gqlUrl = 'https://api.stg.notifi.network/gql';
      storagePrefix = 'notifi-jwt:stg';
      break;
    case BlockchainEnvironment.DevNet:
      gqlUrl = 'https://api.dev.notifi.network/gql';
      storagePrefix = 'notifi-jwt:dev';
      break;
    case BlockchainEnvironment.LocalNet:
      gqlUrl = 'https://localhost:5001/gql';
      storagePrefix = 'notifi-jwt:local';
      break;
    default:
      assertUnreachable(env);
  }

  return {
    gqlUrl,
    storagePrefix,
  };
};

const assertUnreachable = (_x: never): never => {
  throw new Error('This should never be reached');
};

export default useNotifiConfig;
