import { Types } from '@notifi-network/notifi-graphql';

export type UserAlert = Pick<
  Types.AlertFragmentFragment,
  'id' | 'name' | 'filter' | 'filterOptions' | 'groupName'
>;

export type UserWithAlerts = Readonly<{
  id: string;
  alerts: ReadonlyArray<UserAlert> | undefined;
}>;
