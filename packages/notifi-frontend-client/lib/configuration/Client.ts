import { AuthParams } from './Auth';
import { NotifiEnvironment } from './Env';

/** Initializes the NotifiFrontendClient with the given configuration. */
export type NotifiFrontendConfiguration = AuthParams &
  Readonly<{
    env?: NotifiEnvironment;
    tenantId: string;
    storageOption?: Readonly<{
      driverType?: 'LocalForage' | 'InMemory';
    }>;
  }>;

/** Initializes the NotifiSmartLinkClient with the given configuration. */
export type NotifiSmartLinkClientConfig = {
  env?: NotifiEnvironment;
  authParams: AuthParams;
};
