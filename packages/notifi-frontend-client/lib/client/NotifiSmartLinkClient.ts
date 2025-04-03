import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import {
  AuthParams,
  NotifiSmartLinkClientConfig,
  checkIsConfigWithPublicKey,
} from '../configuration';
import { SmartLinkConfig, isSmartLinkConfig } from '../models/SmartLink';
import { isEvmBlockchain } from './blockchains';

export type ExecuteSmartLinkActionArgs = {
  actionId: string;
  authParams: AuthParams;
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
    const smartLinkConfigRaw = (
      await this._service.getSmartLinkConfig({
        input: {
          id: id,
        },
      })
    ).smartLinkConfig;
    const smartLinkConfigJsonString = smartLinkConfigRaw.smartLinkConfig;
    if (!smartLinkConfigRaw) {
      throw new Error('SmartLinkConfig is undefined');
    }
    const parsed = JSON.parse(smartLinkConfigJsonString);
    if (!isSmartLinkConfig(parsed))
      throw new Error(
        `.fetchSmartLinkConfig: Invalid SmartLinkConfig - ${parsed}`,
      );
    // NOTE: Make sure the isActive field is consistent
    return { ...parsed, isActive: smartLinkConfigRaw.isActive };
  }

  async executeSmartLinkAction(
    args: ExecuteSmartLinkActionArgs,
  ): Promise<void> {
    let actionPayload: SmartLinkAction | undefined = undefined;

    // Try handle different cases in the better way
    if (isEvmBlockchain(this._configuration.authParams.walletBlockchain)) {
      if (checkIsConfigWithPublicKey(this._configuration.authParams)) {
        const activateSmartLinkActionArgs: ActivateSmartLinkActionInput = {
          actionId: args.actionId,
          authParams: this._configuration.authParams,
          input: args.inputs,
        };
        // eslint-disable-next-line
        // @ts-ignore TODO: ⚠️ Endpoint is not available yet
        actionPayload = await this._service.activateSmartLinkAction(
          activateSmartLinkActionArgs,
        );
      }
    }

    if (!actionPayload) {
      throw new Error('Action payload is undefined');
    }
    // ⚠️  Must make sure ActionExecutable is blockchain agnostic
    await args.execute(actionPayload);
  }
}

// TODO: below types will be from gql typegen
type ActivateSmartLinkActionInput = {
  actionId: string;
  authParams: AuthParams; //⚠️ Simiar auth params as loginFromDapp. Maybe Blockchain specific like `blockchainType`, `walletPublickey`, ...etc). See more details below.
  input: Record<number, string>;
};
