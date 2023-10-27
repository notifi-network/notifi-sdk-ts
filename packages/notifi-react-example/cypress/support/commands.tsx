/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { arrayify } from '@ethersproject/bytes';
import {
  ConfigFactoryInput,
  NotifiFrontendClient,
  envUrl,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { ethers } from 'ethers';

import { aliasQuery, hasOperationName } from '../utils';

declare global {
  namespace Cypress {
    interface Chainable {
      clearNotifiStorage(): Promise<void>;
      emptyDefaultTargetGroup(): Promise<void>;
      overrideTenantConfigWithFixture(
        items: Record<string, any>,
        fixtureName?: string,
      ): void;
      mountNotifiSubscriptionCard(): void;
    }
  }
}

const getConnectedWallet = () => {
  const env = Cypress.env('ENV');
  const testWalletSeedPhrase = Cypress.env('MNEMONIC');
  const provider = new ethers.providers.JsonRpcProvider(envUrl(env));
  const wallet = ethers.Wallet.fromMnemonic(testWalletSeedPhrase);
  const connectedWallet = wallet.connect(provider);
  return connectedWallet;
};

const mountNotifiSubscriptionCard = () => {
  const cardId = Cypress.env('CARD_ID');
  const dappAddress = Cypress.env('DAPP_ADDRESS');
  const env = Cypress.env('ENV');
  const walletBlockchain = Cypress.env('WALLET_BLOCKCHAIN');
  const wallet = getConnectedWallet();
  cy.mount(
    <NotifiContext
      dappAddress={dappAddress}
      walletBlockchain={walletBlockchain}
      env={env}
      walletPublicKey={wallet.address}
      signMessage={async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      }}
    >
      <NotifiSubscriptionCard darkMode cardId={cardId} />,
    </NotifiContext>,
  );
};

const overrideTenantConfigWithFixture = (
  items: Record<string, any>,
  fixtureName?: string,
) => {
  const env = Cypress.env('ENV');
  cy.fixture(fixtureName ?? 'test-tenantConfig.json').then((tenantConfig) => {
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
      if (hasOperationName(req, 'findTenantConfig')) {
        req.reply((res) => {
          const originalTenantConfig = JSON.parse(
            res.body.data.findTenantConfig.dataJson,
          );
          const testTenantConfig = {
            ...originalTenantConfig,
            ...tenantConfig,
            ...items,
          };
          res.body.data.findTenantConfig.dataJson =
            JSON.stringify(testTenantConfig);
        });
      }
    });
  });
};

const emptyDefaultTargetGroup = async () => {
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
  const client = newFrontendClient(configInput);
  client.initialize();
  try {
    await client.logIn({
      signMessage: async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      },
      walletBlockchain,
    });
    client.ensureTargetGroup({
      name: 'Default',
      emailAddress: undefined,
      phoneNumber: undefined,
      telegramId: undefined,
      discordId: undefined,
    });
  } catch (e) {
    throw e;
  }
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
Cypress.Commands.add('emptyDefaultTargetGroup', emptyDefaultTargetGroup);
Cypress.Commands.add(
  'overrideTenantConfigWithFixture',
  overrideTenantConfigWithFixture,
);
Cypress.Commands.add(
  'mountNotifiSubscriptionCard',
  mountNotifiSubscriptionCard,
);
