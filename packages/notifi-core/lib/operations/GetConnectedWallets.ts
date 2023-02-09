import { ConnectedWallet, ParameterLessOperation } from '../models';

export type GetConnectedWalletsResult = ReadonlyArray<ConnectedWallet>;

export type GetConnectedWalletsService = Readonly<{
  getConnectedWallets: ParameterLessOperation<GetConnectedWalletsResult>;
}>;
