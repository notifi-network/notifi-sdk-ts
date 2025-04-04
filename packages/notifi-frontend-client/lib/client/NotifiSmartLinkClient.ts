import { NotifiDataplaneClient } from '@notifi-network/notifi-dataplane';
import { NotifiService } from '@notifi-network/notifi-graphql';

import type { NotifiSmartLinkClientConfig } from '../configuration';
import type { SmartLinkConfig } from '../models';
import {
  type ExecuteSmartLinkActionArgs,
  executeSmartLinkActionImpl,
} from './executeSmartLinkAction';
import { fetchSmartLinkConfigImpl } from './fetchSmartLinkConfig';

export class NotifiSmartLinkClient {
  constructor(
    private _configuration: NotifiSmartLinkClientConfig,
    private _service: NotifiService,
    private _dpService: NotifiDataplaneClient,
  ) {}

  async fetchSmartLinkConfig(id: string): Promise<SmartLinkConfig> {
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
