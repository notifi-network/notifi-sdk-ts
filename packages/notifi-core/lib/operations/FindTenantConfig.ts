import { Types } from '@notifi-network/notifi-graphql';

import { Operation, TenantConfig } from '../models';

export type FindTenantConfigInput = Types.FindTenantConfigInput;

export type FindTenantConfigResult = TenantConfig;

export type FindTenantConfigService = Readonly<{
  findTenantConfig: Operation<FindTenantConfigInput, FindTenantConfigResult>;
}>;
