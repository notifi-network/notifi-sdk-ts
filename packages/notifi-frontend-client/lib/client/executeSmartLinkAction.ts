import {
  type ActivateSmartLinkActionInput,
  type ActivateSmartLinkActionResponse,
  NotifiDataplaneClient,
} from '@notifi-network/notifi-dataplane';

import { AuthParams, checkIsConfigWithPublicKey } from '../configuration';
import { isEvmBlockchain } from '../models';

export type ExecuteSmartLinkActionArgs = {
  smartLinkId: string;
  actionId: string;
  inputs: ActivateSmartLinkActionInput['inputs'];
  execute: ActionHandler;
};
export type ActionHandler = (
  action: ActivateSmartLinkActionResponse,
) => Promise<void>;

export const executeSmartLinkActionImpl = async (
  service: NotifiDataplaneClient,
  authParams: AuthParams,
  args: ExecuteSmartLinkActionArgs,
): Promise<void> => {
  let actionPayload: ActivateSmartLinkActionResponse | undefined = undefined;

  // Try handle different cases in the better way
  if (isEvmBlockchain(authParams.walletBlockchain)) {
    if (checkIsConfigWithPublicKey(authParams)) {
      const activateSmartLinkActionArgs: ActivateSmartLinkActionInput = {
        smartLinkId: args.smartLinkId,
        actionId: args.actionId,
        authParams,
        inputs: args.inputs,
      };
      actionPayload = await service.activateSmartLinkAction(
        activateSmartLinkActionArgs,
      );
    }
  }
  if (!actionPayload) {
    throw new Error(
      'NotifiSmartLinkClient.executeSmartLinkActionImpl: Action payload is undefined',
    );
  }
  // TODO: ⚠️  Must make sure ActionExecutable is blockchain agnostic
  await args.execute(actionPayload);
};
