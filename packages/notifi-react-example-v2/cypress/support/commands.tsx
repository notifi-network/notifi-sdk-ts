/// <reference types="cypress" />
import { arrayify } from '@ethersproject/bytes';
import {
  AuthParams,
  EvmUserParams,
  envUrl,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  ActionHandler,
  NotifiCardModal,
  NotifiCardModalProps,
  NotifiSmartLink,
  NotifiSmartLinkContextProvider,
} from '@notifi-network/notifi-react';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { generateMnemonic } from 'bip39';
import { ethers } from 'ethers';
import { ComponentProps, useState } from 'react';

import { aliasQuery, hasOperationName } from '../utils';

declare global {
  namespace Cypress {
    interface Chainable {
      clearNotifiStorage(): Promise<void>;
      updateTargetGroup(targetGroup?: TargetGroup): Promise<void>;

      mountCardModal(isRandomMnemonic?: boolean): void;
      loadCSS(): void;
      overrideCardConfig(items: Record<string, any>): void;
      overrideTargetGroup(isEmpty?: boolean): void;
      /* ⬇ SmartLink commands */
      mountSmartLink(preActionMetadata?: PreActionMetadata): void;
    }
  }
}

const loadCSS = () => {
  cy.document().then((doc) => {
    cy.readFile('../notifi-react/dist/index.css', 'utf-8').then((css) => {
      cy.document().then((doc) => {
        const style = doc.createElement('style');
        style.innerHTML = css;
        doc.head.appendChild(style);
      });
    });
  });
};

const getConnectedWallet = (isRandomMnemonic?: boolean) => {
  const env = Cypress.env('ENV');
  const mnemonic = isRandomMnemonic
    ? generateMnemonic()
    : Cypress.env('MNEMONIC');
  console.info({ mnemonic });
  const provider = new ethers.JsonRpcProvider(envUrl(env));
  const wallet = ethers.Wallet.fromPhrase(mnemonic, provider);
  const connectedWallet = wallet.connect(provider);
  return connectedWallet;
};

const mountCardModal = (isRandomMnemonic?: boolean) => {
  const cardId = Cypress.env('CARD_ID');
  const tenantId = Cypress.env('DAPP_ADDRESS');
  const env = Cypress.env('ENV');
  const walletBlockchain = Cypress.env('WALLET_BLOCKCHAIN');
  const wallet = getConnectedWallet(isRandomMnemonic);
  const copy: NotifiCardModalProps['copy'] = {
    Connect: {
      footerContent: [
        {
          type: 'plain-text',
          text: 'This is an example of some footer content that may link to a ',
        },
        {
          type: 'hyperlink',
          text: 'privacy policy',
          url: 'https://notifi.network',
        },
        { type: 'plain-text', text: ' and ' },
        {
          type: 'hyperlink',
          text: 'terms of service',
          url: 'https://notifi.network',
        },
      ],
    },
  };
  cy.mount(
    <NotifiContextProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      walletPublicKey={wallet.address}
      signMessage={async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      }}
      cardId={cardId}
    >
      <NotifiCardModal darkMode copy={copy} />,
    </NotifiContextProvider>,
  );
};

const overrideCardConfig = (items: Record<string, any>) => {
  const env = Cypress.env('ENV');
  cy.intercept('POST', envUrl(env), (req) => {
    aliasQuery(req, 'findTenantConfig');
    if (hasOperationName(req, 'findTenantConfig')) {
      req.reply((res) => {
        const originalCardConfig = JSON.parse(
          res.body.data.findTenantConfig.dataJson,
        );
        const testCardConfig = {
          ...originalCardConfig,
          ...items,
        };
        res.body.data.findTenantConfig.dataJson =
          JSON.stringify(testCardConfig);
      });
    }
  });
};

const overrideTargetGroup = (isEmpty?: boolean) => {
  isEmpty = isEmpty ?? true;
  const dummyTargetGroup = isEmpty
    ? {
        id: '54a1493f1d6c427bb344373830b180d6',
        name: 'Default',
        emailTargets: [],
        smsTargets: [],
        telegramTargets: [],
        discordTargets: [],
        slackChannelTargets: [],
        web3Targets: [],
      }
    : {
        id: '54a1493f1d6c427bb344373830b180d6',
        name: 'Default',
        emailTargets: [
          {
            emailAddress: 'tester-0.39@notifi.network',
            id: '53c3d549f35b4680b73beb72b7287b6a',
            isConfirmed: false,
            name: 'tester-0.39@notifi.network',
          },
        ],
        smsTargets: [],
        telegramTargets: [],
        discordTargets: [],
        slackChannelTargets: [],
        web3Targets: [],
      };
  const env = Cypress.env('ENV');
  cy.intercept('POST', envUrl(env), (req) => {
    aliasQuery(req, 'fetchFusionData');
    if (hasOperationName(req, 'fetchFusionData')) {
      req.reply((res) => {
        console.info({ tg: res.body.data.targetGroup });
        res.body.data = {
          ...res.body.data,
          targetGroup: [dummyTargetGroup],
        };
      });
    }
  });
};

type TargetGroup = {
  name: 'Default';
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
};

const updateTargetGroup = async (targetGroup?: TargetGroup) => {
  targetGroup = targetGroup ?? { name: 'Default' };
  const dappAddress = Cypress.env('DAPP_ADDRESS');
  const env = Cypress.env('ENV');
  const walletBlockchain = Cypress.env('WALLET_BLOCKCHAIN');
  const wallet = getConnectedWallet();
  const EvmUserParams: EvmUserParams = {
    walletBlockchain: walletBlockchain,
    walletPublicKey: wallet.address,
  };
  const client = instantiateFrontendClient(dappAddress, EvmUserParams, env);
  await client.initialize();
  if (client.userState?.status !== 'authenticated') {
    await client.logIn({
      signMessage: async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      },
      walletBlockchain,
    });
  }
  client.ensureTargetGroup(targetGroup);
};

const clearNotifiStorage = async () => {
  const req = indexedDB.deleteDatabase('notifi');
  req.onsuccess = (event) => {
    console.info(event);
    return;
  };
  req.onerror = (error) => {
    throw error;
  };
};

type PreActionMetadata = {
  isPreActionDisabled: boolean;
};
const mountSmartLink = (preActionMetadata?: PreActionMetadata) => {
  cy.mount(
    <NotifiSmartLinkCypressComponent preActionMetadata={preActionMetadata} />,
  );
};

type NotifiSmartLinkCypressComponentProps = {
  preActionMetadata?: PreActionMetadata;
};
const NotifiSmartLinkCypressComponent: React.FC<
  React.PropsWithChildren<NotifiSmartLinkCypressComponentProps>
> = ({ preActionMetadata }) => {
  const smartLinkId = Cypress.env('SMARTLINK_ID');
  const env = Cypress.env('SMARTLINK_ENV');
  const authParams: AuthParams = {
    walletBlockchain: Cypress.env('WALLET_BLOCKCHAIN'),
    walletPublicKey: getConnectedWallet(true).address,
  };
  const [renderPreAction, setRenderPreAction] = useState(!!preActionMetadata);

  const preAction: ComponentProps<typeof NotifiSmartLink>['preAction'] = {
    disabled: preActionMetadata?.isPreActionDisabled ?? false,
    label: 'Pre Action',
    onClick: async () => setRenderPreAction(false),
  };

  const actionHandler: ActionHandler = async (args) => {
    console.info('Action triggered (react-example-v2)', {
      args,
      authParams,
    });
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

Cypress.Commands.add('clearNotifiStorage', clearNotifiStorage);
Cypress.Commands.add('updateTargetGroup', updateTargetGroup);
Cypress.Commands.add('mountCardModal', mountCardModal);
Cypress.Commands.add('loadCSS', loadCSS);
Cypress.Commands.add('overrideCardConfig', overrideCardConfig);
Cypress.Commands.add('overrideTargetGroup', overrideTargetGroup);
/* ⬇ SmartLink commands */
Cypress.Commands.add('mountSmartLink', mountSmartLink);
