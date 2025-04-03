import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import { AuthParams, checkIsConfigWithPublicKey } from '../configuration';
import { isEvmBlockchain } from './blockchains';

export type ExecuteSmartLinkActionArgs = {
  actionId: string;
  inputs: Record<number, string>;
  execute: ActionHandler;
};
export const executeSmartLinkActionImpl = async (
  service: NotifiService,
  authParams: AuthParams,
  args: ExecuteSmartLinkActionArgs,
): Promise<void> => {
  let actionPayload: SmartLinkAction | undefined = undefined;

  // Try handle different cases in the better way
  if (isEvmBlockchain(authParams.walletBlockchain)) {
    if (checkIsConfigWithPublicKey(authParams)) {
      const activateSmartLinkActionArgs: ActivateSmartLinkActionInput = {
        actionId: args.actionId,
        authParams,
        input: args.inputs,
      };
      // eslint-disable-next-line
      // @ts-ignore TODO: ⚠️ Endpoint is not available yet
      actionPayload = await service.activateSmartLinkAction(
        activateSmartLinkActionArgs,
      );
    }
  }

  if (!actionPayload) {
    throw new Error('Action payload is undefined');
  }
  // ⚠️  Must make sure ActionExecutable is blockchain agnostic
  await args.execute(actionPayload);
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

// TODO: below types will be from gql typegen
type ActivateSmartLinkActionInput = {
  actionId: string;
  authParams: AuthParams; //⚠️ Simiar auth params as loginFromDapp. Maybe Blockchain specific like `blockchainType`, `walletPublickey`, ...etc). See more details below.
  input: Record<number, string>;
};
