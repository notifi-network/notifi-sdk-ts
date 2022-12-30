import type { Alert } from '@notifi-network/notifi-core';

export type TenantUserAlert = Pick<
  Alert,
  'id' | 'name' | 'groupName' | 'filter' | 'filterOptions' | 'sourceGroup'
>;
