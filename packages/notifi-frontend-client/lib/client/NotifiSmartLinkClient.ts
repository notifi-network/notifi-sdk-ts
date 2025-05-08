import {
  ActivateSmartLinkActionInput,
  ActivateSmartLinkActionResponse,
  NotifiDataplaneClient,
} from '@notifi-network/notifi-dataplane';
import { NotifiService } from '@notifi-network/notifi-graphql';

import type { NotifiSmartLinkClientConfig } from '../configuration';
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

  async activateSmartLinkAction(
    args: Omit<ActivateSmartLinkActionInput, 'authParams'>,
  ): Promise<ActivateSmartLinkActionResponse> {
    if (!this._configuration.authParams) {
      throw new Error(
        'NotifiSmartLinkClient.activateSmartLinkAction: authParams is required',
      );
    }

    const SmartLinkConfigWithIsActive = await this.fetchSmartLinkConfig(
      args.smartLinkId,
    );

    if (
      this._configuration.authParams.walletBlockchain !==
      SmartLinkConfigWithIsActive.smartLinkConfig.blockchainType
    ) {
      throw new Error(
        `NotifiSmartLinkClient.executeSmartLinkAction: connected wallet (now ${this._configuration.authParams.walletBlockchain}) must be on (${SmartLinkConfigWithIsActive.smartLinkConfig.blockchainType}) blockchain`,
      );
    }

    return this._dpService.activateSmartLinkAction({
      smartLinkId: args.smartLinkId,
      actionId: args.actionId,
      authParams: this._configuration.authParams,
      inputs: args.inputs,
    });
  }
}
