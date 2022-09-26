import { Operation, TenantConfig } from '../models';

export type FindTenantConfigInput = Readonly<{
  tenant: string;
  type: 'SUBSCRIPTION_CARD';
  id: string;
}>;
export type FindTenantConfigResult = TenantConfig;

export type FindTenantConfigService = Readonly<{
  findTenantConfig: Operation<FindTenantConfigInput, FindTenantConfigResult>;
}>;
