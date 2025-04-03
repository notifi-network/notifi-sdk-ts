import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import { NotifiSmartLinkClientConfig } from '../configuration';
import { SmartLinkConfig } from '../models/SmartLink';
import { executeSmartLinkActionImpl } from './executeSmartLinkAction';
import { fetchSmartLinkConfigImpl } from './fetchSmartLinkConfig';

export type ExecuteSmartLinkActionArgs = {
  actionId: string;
  inputs: Record<number, string>;
  execute: ActionHandler;
};

// TBC: ⚠️  Must make sure ActionExecutable is blockchain agnostic
// export type EvmActionHandler = (payload: ActionExecutable) => Promise<void>;

export type ActionHandler = (action: SmartLinkAction) => Promise<void>;

type SmartLinkAction = {
  blockchainType: Types.BlockchainType;
  smartLinkId: string;
  type: 'HTML' | 'Transaction';
  data: string;
};

export class NotifiSmartLinkClient {
  constructor(
    private _configuration: NotifiSmartLinkClientConfig,
    private _service: NotifiService,
  ) {}

  async fetchSmartLinkConfig(id: string): Promise<SmartLinkConfig> {
    return await fetchSmartLinkConfigImpl(this._service, id);
  }

  async executeSmartLinkAction(
    args: ExecuteSmartLinkActionArgs,
  ): Promise<void> {
    return await executeSmartLinkActionImpl(
      this._service,
      this._configuration.authParams,
      args,
    );
  }
}
