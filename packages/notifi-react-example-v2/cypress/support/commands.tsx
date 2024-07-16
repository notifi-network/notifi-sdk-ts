/// <reference types="cypress" />
import { arrayify } from '@ethersproject/bytes';
import {
  ConfigFactoryInput,
  envUrl,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import {
  NotifiCardModal,
  NotifiCardModalProps,
} from '@notifi-network/notifi-react';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { generateMnemonic } from 'bip39';
import { ethers } from 'ethers';

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
  console.log({ mnemonic });
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
    Ftu: {
      FtuTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
          },
        },
      },
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
        webhookTargets: [],
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
        webhookTargets: [],
        discordTargets: [],
        slackChannelTargets: [],
        web3Targets: [],
      };
  const env = Cypress.env('ENV');
  cy.intercept('POST', envUrl(env), (req) => {
    aliasQuery(req, 'fetchFusionData');
    if (hasOperationName(req, 'fetchFusionData')) {
      req.reply((res) => {
        console.log({ tg: res.body.data.targetGroup });
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
  const configInput: ConfigFactoryInput = {
    account: {
      publicKey: wallet.address,
    },
    tenantId: dappAddress,
    walletBlockchain: walletBlockchain,
    env,
  };
  const client = newFrontendClient(configInput) as NotifiFrontendClient;
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
    console.log(event);
    return;
  };
  req.onerror = (error) => {
    throw error;
  };
};

Cypress.Commands.add('clearNotifiStorage', clearNotifiStorage);
Cypress.Commands.add('updateTargetGroup', updateTargetGroup);
Cypress.Commands.add('mountCardModal', mountCardModal);
Cypress.Commands.add('loadCSS', loadCSS);
Cypress.Commands.add('overrideCardConfig', overrideCardConfig);
Cypress.Commands.add('overrideTargetGroup', overrideTargetGroup);
