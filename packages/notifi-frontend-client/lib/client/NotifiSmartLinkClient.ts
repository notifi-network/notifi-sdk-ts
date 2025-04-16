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
    const SmartLinkConfigWithIsActive = await this.fetchSmartLinkConfig(
      args.smartLinkId,
    );

    if (
      this._configuration.authParams.walletBlockchain !==
      SmartLinkConfigWithIsActive.smartLinkConfig.blockchainType
    ) {
      throw new Error(
        `executeSmartLinkAction: connected wallet (now ${this._configuration.authParams.walletBlockchain}) must be on (${SmartLinkConfigWithIsActive.smartLinkConfig.blockchainType}) blockchain`,
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

// TODO: Temp note to be removed - this check should happen in dataplane client
// const _activateSmartLinkAction = async (
//   service: NotifiDataplaneClient,
//   authParams: AuthParams,
//   args: ActivateSmartLinkActionInput,
// ): Promise<ActivateSmartLinkActionResponse> => {
//   if (checkIsConfigWithPublicKey(authParams)) {
//     /* CASE#1: EVM chains */
//     if (isEvmBlockchain(authParams.walletBlockchain)) {
//       return service.activateSmartLinkAction(args);
//     }

//     if (authParams.walletBlockchain === 'SOLANA') {
//       /* CASE#2: Solana - Await to implement */
//     }
//   }

//   if (checkIsConfigWithDelegate(authParams)) {
//     /* CASE#3: Cosmos - Await to implement */
//   }

//   if (checkIsConfigWithPublicKeyAndAddress(authParams)) {
//     /* CASE#4: Other chains - Await to implement */
//   }

//   if (checkIsConfigWithOidc(authParams)) {
//     /* CASE#5: OFF_CHAIN - Await to implement */
//   }
//   const errMsg = `NotifiSmartLinkClient.executeSmartLinkActionImpl: SmartLink action for ${authParams.walletBlockchain} is not supported yet`;
//   throw new Error(errMsg);
// };
