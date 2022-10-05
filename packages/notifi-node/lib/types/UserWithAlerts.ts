import type { Alert } from '@notifi-network/notifi-core';

export type UserAlert = Pick<
  Alert,
  'id' | 'name' | 'filter' | 'filterOptions' | 'groupName'
>;

export type UserWithAlerts = Readonly<{
  id: string;
  alerts: ReadonlyArray<UserAlert>;
}>;
