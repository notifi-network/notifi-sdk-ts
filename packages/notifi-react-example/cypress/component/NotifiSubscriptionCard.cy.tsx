import { envUrl } from '@notifi-network/notifi-frontend-client';
import '@notifi-network/notifi-react-card/dist/index.css';

import { aliasMutation, aliasQuery } from '../utils/graphql-utils';

describe('NotifiSubscriptionCard.cy.tsx', () => {
  window.Buffer = require('buffer').Buffer;

  beforeEach(() => {
    cy.wait(2000); // Wait few seconds to avoid "Too many requests" in the case of duplicate requests from previous test item
    const env = Cypress.env('ENV');
    cy.emptyDefaultTargetGroup();
    cy.clearNotifiStorage();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'logInFromDapp');
      aliasQuery(req, 'findTenantConfig');
      aliasMutation(req, 'updateTargetGroup');
      aliasQuery(req, 'fetchData');
    });
  });

  it('Sign-up: destination NOT required', () => {
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: false });
    cy.mountNotifiSubscriptionCard();

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });
    cy.get('[data-cy="notifiSubscribeButton"').should('exist');
    cy.wait(3000); // Wait few seconds to avoid "Too many requests" against "loginFromDapp" gql query

    /** Click NotifiSubscribeButton: subscribe button (logInFromDapp)
     * Wait for the following gql request done to be redirected back to history view
     * @description This is a hack to avoid intercepting all the alerts subscribing gql requests (Default targetGroup exists)
     */
    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlLogInFromDappQuery')
      .its('response.statusCode')
      .should('eq', 200);
    cy.wait('@gqlFetchDataQuery').its('response.statusCode').should('eq', 200);
    cy.wait('@gqlFetchDataQuery').its('response.statusCode').should('eq', 200);

    // TODO: FTU flow - isContactInfoRequired=false
  });

  it('Sign-up: destination required', () => {
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: true });
    cy.mountNotifiSubscriptionCard();

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });
    cy.get('[data-cy="notifiSubscribeButton"').should('exist');
    cy.get('[data-cy="notifiEmailInput"').type('tester@notifi.network');
    cy.wait(3000); // Wait few seconds to avoid "Too many requests" against "loginFromDapp" gql query

    /** Click NotifiSubscribeButton: subscribe button (logInFromDapp)
     * Wait for the following gql request done to be redirected back to history view
     * @description This is a hack to avoid intercepting all the alerts subscribing gql requests (Default targetGroup exists)
     */
    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlLogInFromDappQuery')
      .its('response.statusCode')
      .should('eq', 200);
    cy.wait('@gqlFetchDataQuery').its('response.statusCode').should('eq', 200);
    cy.wait('@gqlFetchDataQuery').its('response.statusCode').should('eq', 200);

    // TODO: FTU flow - isContactInfoRequired=true
  });
});
