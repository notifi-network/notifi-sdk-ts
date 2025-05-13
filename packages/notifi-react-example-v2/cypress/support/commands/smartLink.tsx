import {
  AuthParams,
  envUrl,
  isEvmBlockchain,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import {
  ActionHandler,
  NotifiSmartLink,
  NotifiSmartLinkContextProvider,
} from '@notifi-network/notifi-react';
import { ethers } from 'ethers';
import { ComponentProps, useState } from 'react';

const getConnectedWallet = () => {
  const mnemonic = Cypress.env('MNEMONIC');
  const env = Cypress.env('SMARTLINK_ENV');
  const provider = new ethers.JsonRpcProvider(envUrl(env));
  return ethers.Wallet.fromPhrase(mnemonic, provider).connect(provider);
};

const NotifiSmartLinkCypressComponent: React.FC<{
  blockchainType: AuthParams['walletBlockchain'];
  preActionMetadata?: { isPreActionDisabled: boolean };
}> = ({ blockchainType, preActionMetadata }) => {
  const smartLinkId = Cypress.env('SMARTLINK_ID');
  const env = Cypress.env('SMARTLINK_ENV');
  const wallet = getConnectedWallet();

  if (!isEvmBlockchain(blockchainType))
    throw new Error('Currently only EVM blockchains are supported');

  const authParams: AuthParams = {
    walletBlockchain: blockchainType,
    walletPublicKey: wallet.address,
  };

  const [renderPreAction, setRenderPreAction] = useState(!!preActionMetadata);
  const preAction: ComponentProps<typeof NotifiSmartLink>['preAction'] = {
    disabled: preActionMetadata?.isPreActionDisabled ?? false,
    label: 'Pre Action',
    onClick: async () => setRenderPreAction(false),
  };

  const actionHandler: ActionHandler = async (args) => {
    console.info('Action triggered (smartlink)', { args, authParams });
  };

  return (
    <NotifiSmartLinkContextProvider env={env} authParams={authParams}>
      <NotifiSmartLink
        smartLinkId={smartLinkId}
        actionHandler={actionHandler}
        preAction={renderPreAction ? preAction : undefined}
      />
    </NotifiSmartLinkContextProvider>
  );
};
export type PreActionMetadata = {
  isPreActionDisabled: boolean;
};

const mountSmartLink = (
  blockchainType: Exclude<Types.BlockchainType, 'UNSPECIFIED'>,
  preActionMetadata?: PreActionMetadata,
) => {
  cy.mount(
    <NotifiSmartLinkCypressComponent
      preActionMetadata={preActionMetadata}
      blockchainType={blockchainType}
    />,
  );
};

Cypress.Commands.add('mountSmartLink', mountSmartLink);
