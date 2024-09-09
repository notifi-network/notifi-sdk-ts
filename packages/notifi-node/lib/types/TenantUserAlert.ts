import { Types } from '@notifi-network/notifi-graphql';

export type TenantUserAlert = Pick<
  Types.AlertFragmentFragment,
  'id' | 'name' | 'groupName' | 'filter' | 'filterOptions' | 'sourceGroup'
>;
