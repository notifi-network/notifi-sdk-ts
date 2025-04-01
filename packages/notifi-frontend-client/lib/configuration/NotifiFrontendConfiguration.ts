import { isEvmBlockchain } from '../client';
import { AuthParams } from './Auth';
import { NotifiEnvironment } from './Env';

export type NotifiEnvironmentConfiguration = Readonly<{
  env?: NotifiEnvironment;
  tenantId: string;
  storageOption?: Readonly<{
    driverType?: 'LocalForage' | 'InMemory';
  }>;
}>;

export type NotifiConfigWithPublicKey = Extract<
  AuthParams,
  { walletPublicKey: string }
> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithPublicKeyAndAddress = Extract<
  AuthParams,
  { authenticationKey: string }
> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithDelegate = Extract<
  AuthParams,
  { delegatedAddress: string }
> &
  NotifiEnvironmentConfiguration;

export type NotifiConfigWithOidc = Extract<
  AuthParams,
  { userAccount: string }
> &
  NotifiEnvironmentConfiguration;

export type NotifiFrontendConfiguration =
  | NotifiConfigWithPublicKey
  | NotifiConfigWithPublicKeyAndAddress
  | NotifiConfigWithDelegate
  | NotifiConfigWithOidc;

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type ConfigFactoryInput =
  | ConfigFactoryInputPublicKeyAndAddress
  | ConfigFactoryInputPublicKey
  | ConfigFactoryInputDelegated
  | ConfigFactoryInputOidc;

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type ConfigFactoryInputDelegated = {
  account: Readonly<{
    address: string;
    publicKey: string;
    delegatorAddress: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithDelegate['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type ConfigFactoryInputPublicKeyAndAddress = {
  account: Readonly<{
    address: string;
    publicKey: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKeyAndAddress['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type ConfigFactoryInputPublicKey = {
  account: Readonly<{
    publicKey: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: NotifiConfigWithPublicKey['walletBlockchain'];
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type ConfigFactoryInputOidc = {
  account: Readonly<{
    userAccount: string;
  }>;
  tenantId: string;
  env?: NotifiEnvironment;
  walletBlockchain: 'OFF_CHAIN';
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
};

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export type FrontendClientConfigFactory<T extends NotifiFrontendConfiguration> =
  (
    args: T extends NotifiConfigWithPublicKeyAndAddress
      ? ConfigFactoryInputPublicKeyAndAddress
      : T extends NotifiConfigWithDelegate
        ? ConfigFactoryInputDelegated
        : T extends NotifiConfigWithPublicKey
          ? ConfigFactoryInputPublicKey
          : ConfigFactoryInputOidc,
  ) => NotifiFrontendConfiguration;

/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const configFactoryPublicKey: FrontendClientConfigFactory<
  NotifiConfigWithPublicKey
> = (args) => {
  let walletPublicKey = args.account.publicKey;
  if (isEvmBlockchain(args.walletBlockchain)) {
    walletPublicKey = walletPublicKey.toLowerCase();
  }
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    walletPublicKey,
    storageOption: args.storageOption,
  };
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const configFactoryPublicKeyAndAddress: FrontendClientConfigFactory<
  NotifiConfigWithPublicKeyAndAddress
> = (args) => {
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    authenticationKey: args.account.publicKey,
    accountAddress: args.account.address,
    storageOption: args.storageOption,
  };
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const configFactoryDelegated: FrontendClientConfigFactory<
  NotifiConfigWithDelegate
> = (args) => {
  return {
    tenantId: args.tenantId,
    env: args.env,
    walletBlockchain: args.walletBlockchain,
    delegatedAddress: args.account.address,
    delegatedPublicKey: args.account.publicKey,
    delegatorAddress: args.account.delegatorAddress,
    storageOption: args.storageOption,
  };
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const configFactoryOidc: FrontendClientConfigFactory<NotifiConfigWithOidc> = (
  args,
) => {
  return {
    tenantId: args.tenantId,
    env: args.env,
    userAccount: args.account.userAccount,
    storageOption: args.storageOption,
    walletBlockchain: args.walletBlockchain,
  };
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const isWithPubkeyAndAddress = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputPublicKeyAndAddress => {
  return 'address' in config.account && !isWithDelegate(config);
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const isWithDelegate = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputDelegated => {
  return 'delegatorAddress' in config.account;
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
const isWithOidc = (
  config: ConfigFactoryInput,
): config is ConfigFactoryInputOidc => {
  return (
    'userAccount' in config.account && config.walletBlockchain === 'OFF_CHAIN'
  );
};
/**@deprecated No longer need to use configFactory, use instantiateFrontendClient instead */
export const newFrontendConfig = (
  config: ConfigFactoryInput,
): NotifiFrontendConfiguration => {
  if (isWithOidc(config)) {
    return configFactoryOidc(config);
  } else if (isWithDelegate(config)) {
    return configFactoryDelegated(config);
  } else if (isWithPubkeyAndAddress(config)) {
    return configFactoryPublicKeyAndAddress(config);
  } else {
    return configFactoryPublicKey(config);
  }
};
