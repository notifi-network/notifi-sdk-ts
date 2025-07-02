import { arrayify } from '@ethersproject/bytes';
import {
  envUrl,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  NotifiCardModal,
  NotifiCardModalProps,
  NotifiContextProvider,
} from '@notifi-network/notifi-react';
import { generateMnemonic } from 'bip39';
import { ethers } from 'ethers';

import { aliasQuery, hasOperationName } from '../../utils';

export type TargetGroup = {
  name: 'Default';
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
};
export const getConnectedWallet = (isRandomMnemonic?: boolean) => {
  const env = Cypress.env('ENV');
  const mnemonic = isRandomMnemonic
    ? generateMnemonic()
    : Cypress.env('MNEMONIC');
  const provider = new ethers.JsonRpcProvider(envUrl(env));
  const wallet = ethers.Wallet.fromPhrase(mnemonic, provider);
  return wallet.connect(provider);
};

export const mountCardModal = (isRandomMnemonic?: boolean) => {
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
      <NotifiCardModal darkMode copy={copy} />
    </NotifiContextProvider>,
  );
};

export const overrideCardConfig = (items: Record<string, any>) => {
  const env = Cypress.env('ENV');
  cy.intercept('POST', envUrl(env), (req) => {
    aliasQuery(req, 'findTenantConfig');
    if (hasOperationName(req, 'findTenantConfig')) {
      req.reply((res) => {
        const original = JSON.parse(res.body.data.findTenantConfig.dataJson);
        res.body.data.findTenantConfig.dataJson = JSON.stringify({
          ...original,
          ...items,
        });
      });
    }
  });
};

export const overrideTargetGroup = (isEmpty?: boolean) => {
  const dummyTargetGroup =
    (isEmpty ?? true)
      ? {
          id: 'id',
          name: 'Default',
          emailTargets: [],
          smsTargets: [],
          telegramTargets: [],
          discordTargets: [],
          slackChannelTargets: [],
          web3Targets: [],
        }
      : {
          id: 'id',
          name: 'Default',
          emailTargets: [
            {
              emailAddress: 'test@notifi.network',
              id: 'id',
              isConfirmed: false,
              name: 'test@notifi.network',
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
        res.body.data = {
          ...res.body.data,
          targetGroup: [dummyTargetGroup],
        };
      });
    }
  });
};

export const updateTargetGroup = async (targetGroup?: TargetGroup) => {
  const dappAddress = Cypress.env('DAPP_ADDRESS');
  const env = Cypress.env('ENV');
  const walletBlockchain = Cypress.env('WALLET_BLOCKCHAIN');
  const wallet = getConnectedWallet();

  const client = instantiateFrontendClient(
    dappAddress,
    { walletBlockchain, walletPublicKey: wallet.address },
    env,
  );

  await client.auth.initialize();
  if (client.auth.userState?.status !== 'authenticated') {
    await client.auth.logIn({
      signMessage: async (message: Uint8Array) =>
        arrayify(await wallet.signMessage(message)),
      walletBlockchain,
    });
  }

  await client.ensureTargetGroup(targetGroup ?? { name: 'Default' });
};

export const clearNotifiStorage = async () => {
  const req = indexedDB.deleteDatabase('notifi');
  req.onsuccess = () => console.info('Storage cleared');
  req.onerror = (e) => {
    throw e;
  };
};

Cypress.Commands.add('clearNotifiStorage', clearNotifiStorage);
Cypress.Commands.add('mountCardModal', mountCardModal);
Cypress.Commands.add('overrideCardConfig', overrideCardConfig);
Cypress.Commands.add('overrideTargetGroup', overrideTargetGroup);
Cypress.Commands.add('updateTargetGroup', updateTargetGroup);
