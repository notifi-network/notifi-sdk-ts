import { envUrl } from '@notifi-network/notifi-frontend-client';

import { aliasQuery } from '../utils';

describe('NotifiSmartLink Test', () => {
  beforeEach(() => {
    cy.loadCSS();
    const env = Cypress.env('SMARTLINK_ENV');
    const smartLinkId = Cypress.env('SMARTLINK_ID');
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'getSmartLinkConfig');
    });

    cy.intercept(
      'POST',
      `${envUrl(env, 'http', 'notifi-dataplane')}/Link/${smartLinkId}`,
      (req) => {
        req.alias = 'dpapiActivateSmartLinkAction';
      },
    );
  });

  it('Render SmartLink', () => {
    cy.mountSmartLink('ARBITRUM');
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.get('.notifi-smartlink-action-btn')
      .should('exist')
      .should('be.disabled');
    cy.get('.notifi-smartlink-action-input-textbox-input')
      .should('exist')
      .first()
      .type('1');
    cy.get('.notifi-smartlink-action-btn').should('exist').should('be.enabled');
  });

  it('Execute SmartLink: ERROR - unmatched blockchain', () => {
    // TODO
  });

  it('Execute SmartLink: w/o preAction, ', () => {
    cy.mountSmartLink('ARBITRUM');
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.get('.notifi-smartlink-action-input-textbox-input')
      .should('exist')
      .first()
      .type('1');
    cy.get('.notifi-smartlink-action-btn')
      .should('exist')
      .first()
      .should('be.enabled')
      .click();
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.wait('@dpapiActivateSmartLinkAction').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const body = interception.response?.body;
      expect(body).to.have.property('successMessage');
      expect(body.successMessage).to.be.a('string');
    });
  });

  it('Execute SmartLink - disabled preAction ', () => {
    cy.mountSmartLink('ARBITRUM', {
      isPreActionDisabled: true,
    });
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.get('.notifi-smartlink-action-btn')
      .should('exist')
      .first()
      .should('be.disabled');
  });

  it('Execute SmartLink - enabled preAction ', () => {
    cy.mountSmartLink('ARBITRUM', {
      isPreActionDisabled: false,
    });
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.get('.notifi-smartlink-action-btn')
      .should('exist')
      .first()
      .should('be.enabled')
      .click();

    cy.get('.notifi-smartlink-action-input-textbox-input')
      .should('exist')
      .first()
      .type('1');
    cy.get('.notifi-smartlink-action-btn')
      .should('exist')
      .first()
      .should('be.enabled')
      .click();
    cy.wait('@gqlGetSmartLinkConfigQuery');
    cy.wait('@dpapiActivateSmartLinkAction').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const body = interception.response?.body;
      expect(body).to.have.property('successMessage');
      expect(body.successMessage).to.be.a('string');
    });
  });
});
