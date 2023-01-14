import type { Types } from '@notifi-network/notifi-graphql';

export type GetTenantUserResult = Exclude<
  Types.GetTenantUserQuery['tenantUser'],
  undefined
>;
