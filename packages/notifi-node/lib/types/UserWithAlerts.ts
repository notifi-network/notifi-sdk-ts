import type { Alert } from '@notifi-network/notifi-core';

export type UserAlert = Pick<
  Alert,
  'id' | 'name' | 'filter' | 'filterOptions' | 'groupName'
>;

export type UserWithAlerts = Readonly<{
  alerts: ReadonlyArray<UserAlert>;
}>;
