import {
  ActivateSmartLinkActionInput,
  SmartLinkActionUserInput,
} from '@notifi-network/notifi-dataplane';
import {
  AuthParams,
  SmartLinkConfig,
  envUrl,
} from '@notifi-network/notifi-frontend-client';
import { ethers } from 'ethers';

/* Test Tenant: `notifi.network.unitest` */
export const dappAddress = 'xdjczkhmgann9g24871z';

export const getEvmConnectedWallet = () => {
  const _wallet = ethers.Wallet.createRandom();
  _wallet.connect(new ethers.JsonRpcProvider(envUrl()));
  return _wallet;
};

/* ⬇ NotifiFrontendClient Specific ⬇ */

export const getCardId = (version: 'v1' | 'v2') => {
  if (version === 'v1') {
    return '019305821e1772c1b3b8d07df1d724ee';
  }
  if (version === 'v2') {
    return '0196d28771c2777eaa506898dd4975b4';
  }
  throw new Error('Invalid card version');
};

/* ⬇ NotifiSmartLink Specific ⬇ */

export const smartLink = '1e74002c84f3445480c54424a145a62a';
export const authParams: AuthParams = {
  walletBlockchain: 'ARBITRUM',
  walletPublicKey: '0x0',
};

/**
 * @description Grab nth Action and generate a valid user inputs
 */
export const getActionInput = (
  smartLinkId: string,
  smartLinkConfig: SmartLinkConfig,
  itemNumber: number,
): Omit<ActivateSmartLinkActionInput, 'authParams'> => {
  const smartLinkActions = smartLinkConfig.components.filter(
    (component) => component.type === 'ACTION',
  );
  const actionId = smartLinkActions[itemNumber].id;
  const inputs = smartLinkActions[itemNumber].inputs.reduce(
    (acc: Record<number, SmartLinkActionUserInput>, input, id) => {
      const userInput: SmartLinkActionUserInput =
        input.type === 'TEXTBOX'
          ? {
              type: 'TEXTBOX',
              value: '1',
              id: input.id,
            }
          : {
              type: 'CHECKBOX',
              value: true,
              id: input.id,
            };

      acc[id] = userInput;
      return acc;
    },
    {},
  );
  return { smartLinkId, actionId, inputs };
};
