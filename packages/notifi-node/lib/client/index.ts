import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';

import NotifiClient from './NotifiClient';

export type { NotifiEnvironment };

export { NotifiClient };

export * from './createNotifiService';
export * from './createSubscriptionClient';
export * from './subscribeTenantEntityUpdated';
