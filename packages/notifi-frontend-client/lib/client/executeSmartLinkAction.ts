import {
  type ActivateSmartLinkActionInput,
  type ActivateSmartLinkActionResponse,
  NotifiDataplaneClient,
} from '@notifi-network/notifi-dataplane';

import {
  AuthParams,
  checkIsConfigWithDelegate,
  checkIsConfigWithOidc,
  checkIsConfigWithPublicKey,
  checkIsConfigWithPublicKeyAndAddress,
} from '../configuration';
import { isEvmBlockchain } from '../models';

export type ExecuteSmartLinkActionArgs = Omit<
  ActivateSmartLinkActionInput,
  'authParams'
> & {
  execute: ActionHandler;
};

type ActionHandlerArgs = {
  smartLinkId: string;
  actionId: string;
  payload: ActivateSmartLinkActionResponse;
};

export type ActionHandler = (args: ActionHandlerArgs) => Promise<void>;

export const executeSmartLinkActionImpl = async (
  service: NotifiDataplaneClient,
  authParams: AuthParams,
  args: ExecuteSmartLinkActionArgs,
): Promise<void> => {
  const activateSmartLinkActionArgs: ActivateSmartLinkActionInput = {
    smartLinkId: args.smartLinkId,
    actionId: args.actionId,
    authParams,
    inputs: args.inputs,
  };

  const actionPayload = await _activateSmartLinkAction(
    service,
    authParams,
    activateSmartLinkActionArgs,
  );

  await args.execute({
    smartLinkId: args.smartLinkId,
    actionId: args.actionId,
    payload: actionPayload,
  });
};

/* Internal Utils */

const _activateSmartLinkAction = async (
  service: NotifiDataplaneClient,
  authParams: AuthParams,
  args: ActivateSmartLinkActionInput,
): Promise<ActivateSmartLinkActionResponse> => {
  if (checkIsConfigWithPublicKey(authParams)) {
    /* CASE#1: EVM chains */
    if (isEvmBlockchain(authParams.walletBlockchain)) {
      const activateSmartLinkActionArgs: ActivateSmartLinkActionInput = {
        smartLinkId: args.smartLinkId,
        actionId: args.actionId,
        authParams,
        inputs: args.inputs,
      };
      return service.activateSmartLinkAction(activateSmartLinkActionArgs);
    }

    if (authParams.walletBlockchain === 'SOLANA') {
      /* CASE#2: Solana - Await to implement */
    }
  }

  if (checkIsConfigWithDelegate(authParams)) {
    /* CASE#3: Cosmos - Await to implement */
  }

  if (checkIsConfigWithPublicKeyAndAddress(authParams)) {
    /* CASE#4: Other chains - Await to implement */
  }

  if (checkIsConfigWithOidc(authParams)) {
    /* CASE#5: OFF_CHAIN - Await to implement */
  }
  const errMsg = `NotifiSmartLinkClient.executeSmartLinkActionImpl: SmartLink action for ${authParams.walletBlockchain} is not supported yet`;
  throw new Error(errMsg);
};
