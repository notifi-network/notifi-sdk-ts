/// <reference types="cypress" />
import { AuthParams } from '@notifi-network/notifi-frontend-client';

import { TargetGroup } from './cardModal';
import './cardModal';
import { PreActionMetadata } from './smartLink';
import './smartLink';

declare global {
  namespace Cypress {
    interface Chainable {
      /* ⬇ NotifiCardModal commands */
      clearNotifiStorage(): Promise<void>;
      updateTargetGroup(targetGroup?: TargetGroup): Promise<void>;
      mountCardModal(isRandomMnemonic?: boolean): void;
      overrideCardConfig(items: Record<string, any>): void;
      overrideTargetGroup(isEmpty?: boolean): void;
      /* ⬇ NotifiSmartLink commands */
      mountSmartLink(
        blockchainType: AuthParams['walletBlockchain'],
        preActionMetadata?: PreActionMetadata,
      ): void;
      /* ⬇ Common commands */
      loadCSS(): void;
    }
  }
}

export const loadCSS = () => {
  cy.document().then((doc) => {
    cy.readFile('../notifi-react/dist/index.css', 'utf-8').then((css) => {
      const style = doc.createElement('style');
      style.innerHTML = css;
      doc.head.appendChild(style);
    });
  });
};

Cypress.Commands.add('loadCSS', loadCSS);
