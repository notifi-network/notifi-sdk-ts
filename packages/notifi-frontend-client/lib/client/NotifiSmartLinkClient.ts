import { NotifiDataplaneClient } from '@notifi-network/notifi-dataplane';
import { NotifiService } from '@notifi-network/notifi-graphql';

import type { NotifiSmartLinkClientConfig } from '../configuration';
import {
  type ExecuteSmartLinkActionArgs,
  executeSmartLinkActionImpl,
} from './executeSmartLinkAction';
import {
  SmartLinkConfigWithIsActive,
  fetchSmartLinkConfigImpl,
} from './fetchSmartLinkConfig';

export class NotifiSmartLinkClient {
  constructor(
    private _configuration: NotifiSmartLinkClientConfig,
    private _service: NotifiService,
    private _dpService: NotifiDataplaneClient,
  ) {}

  async fetchSmartLinkConfig(id: string): Promise<SmartLinkConfigWithIsActive> {
    return await fetchSmartLinkConfigImpl(this._service, id);
  }

  async executeSmartLinkAction(
    args: ExecuteSmartLinkActionArgs,
  ): Promise<void> {
    return await executeSmartLinkActionImpl(
      this._dpService,
      this._configuration.authParams,
      args,
    );
  }
}
