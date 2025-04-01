import { AuthParams } from './Auth';
import { NotifiEnvironment } from './Env';

export type NotifiFrontendConfiguration = AuthParams &
  Readonly<{
    env?: NotifiEnvironment;
    tenantId: string;
    storageOption?: Readonly<{
      driverType?: 'LocalForage' | 'InMemory';
    }>;
  }>;
