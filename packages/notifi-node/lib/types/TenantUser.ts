import { TenantConnectedWallet } from './TenantConnectedWallet';
import { TenantUserAlert } from './TenantUserAlert';

export type TenantUser = Readonly<{
  id: string;
  alerts: ReadonlyArray<TenantUserAlert>;
  connectedWallets: ReadonlyArray<TenantConnectedWallet>;
}>;
