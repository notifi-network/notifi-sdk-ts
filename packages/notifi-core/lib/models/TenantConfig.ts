import { Types } from '@notifi-network/notifi-graphql';

/**
 * Config object for a tenant
 *
 * @remarks
 * Config object for a tenant
 *
 * @property {string | null} id - Id of the Tenant Config
 * @property {string} type - The kind of config it is
 * @property {string | null} dataJson - The json payload of the config
 *
 */
export type TenantConfig = Readonly<{
  id: string | null;
  type: string;
  dataJson: string | null;
  fusionEvent: Array<Types.FusionEventDescriptor>;
}>;
