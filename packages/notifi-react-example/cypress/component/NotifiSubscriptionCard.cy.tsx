import { envUrl } from '@notifi-network/notifi-frontend-client';
import '@notifi-network/notifi-react-card/dist/index.css';

import { aliasMutation, aliasQuery } from '../utils/graphql-utils';

window.Buffer = require('buffer').Buffer;

describe('Sign-up', () => {
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
      aliasQuery(req, 'getUserSettings');
    });
  });

  it('W/O destination', () => {
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: false });
    cy.mountNotifiSubscriptionCard();
    cy.overrideUserSettingsWithFixture('userSettingsFtuNull.json');

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });
    cy.get('[data-cy="notifiSubscribeButton"').should('exist');
    cy.wait(3000); // Wait few seconds to avoid "Too many requests" against "loginFromDapp" gql query

    /** Click NotifiSubscribeButton - subscribe (logInFromDapp)
     * @description This is a hack to avoid intercepting all the alerts subscribing gql requests (Default targetGroup exists)
     */
    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlLogInFromDappQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlGetUserSettingsQuery');

    cy.get('[data-cy="configAlertModal"').should('exist');
    cy.get('[data-cy="configAlertModalDoneButton"').should('exist').click();

    cy.get('[data-cy="signupBannerButton"').should('exist').click();
    cy.get('[data-cy="notifiEmailInput"')
      .should('exist')
      .type('tester@notifi.network');

    /**
     * Click NotifiSubscribeButton - Update
     */
    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlUpdateTargetGroupMutation')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery');

    cy.get('[data-cy="configAlertModalDoneButton"').should('exist').click();
    cy.get('[data-cy="verifyBannerButton"').should('exist').click();
    cy.get('[data-cy="previewCard"').should('exist');
  });

  it('W/ destination - Case#1', () => {
    // destination confirmed process
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: true });
    cy.mountNotifiSubscriptionCard();
    cy.overrideFetchDataTargetGroupWithFixture('confirmedTargetGroup.json');
    cy.overrideUserSettingsWithFixture('userSettingsFtuNull.json');

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });
    cy.get('[data-cy="notifiSubscribeButton"').should('exist');
    cy.get('[data-cy="notifiEmailInput"').type('tester@notifi.network');
    cy.get('[data-cy="notifiTelegramInput"').type('tester');
    cy.wait(3000); // Wait few seconds to avoid "Too many requests" against "loginFromDapp" gql query

    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlLogInFromDappQuery')
      .wait('@gqlUpdateTargetGroupMutation')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlGetUserSettingsQuery');

    cy.get('[data-cy="configDestinationModalVerifyLabel"').should('exist');
    cy.get('[data-cy="configDestinationModalNextButton"')
      .should('exist')
      .click();
    cy.get('[data-cy="configAlertModal"').should('exist');
    // ... the rest of the test is the same as the "W/O destination" test
  });

  it('W/ destination - Case#2', () => {
    // destination NOT confirmed process
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: true });
    cy.mountNotifiSubscriptionCard();
    cy.overrideFetchDataTargetGroupWithFixture('notConfirmedTargetGroup.json');
    cy.overrideUserSettingsWithFixture('userSettingsFtuNull.json');

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });
    cy.get('[data-cy="notifiSubscribeButton"').should('exist');
    cy.get('[data-cy="notifiEmailInput"').type('tester@notifi.network');
    cy.get('[data-cy="notifiTelegramInput"').type('tester');
    cy.wait(3000); // Wait few seconds to avoid "Too many requests" against "loginFromDapp" gql query

    /** Click NotifiSubscribeButton: subscribe button (logInFromDapp)
     * @description This is a hack to avoid intercepting all the alerts subscribing gql requests (Default targetGroup exists)
     */
    cy.get('[data-cy="notifiSubscribeButton"').click();
    cy.wait('@gqlLogInFromDappQuery')
      .wait('@gqlUpdateTargetGroupMutation')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlFetchDataQuery')
      .wait('@gqlGetUserSettingsQuery');

    cy.get('[data-cy="configDestinationModalConfirmTelegramButton"').should(
      'exist',
    );
    cy.get('[data-cy="configDestinationModalNextButton"')
      .should('exist')
      .click();
    cy.get('[data-cy="configAlertModal"').should('exist');
    // ... the rest of the test is the same as the "W/O destination" test
  });
});

describe('Ftu stage persistence', () => {
  beforeEach(() => {
    cy.wait(2000); // Wait for previous test's requests to finish
  });
  it('Case#1: FTU stage AlertsModal persisted', () => {
    // AlertModal is persisted if FTU process is not completed
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: false });
    cy.mountNotifiSubscriptionCard();
    cy.overrideUserSettingsWithFixture('userSettingsFtuAlerts.json');

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });

    cy.get('[data-cy="configAlertModal"').should('exist');
  });
  it('Case#2: FTU stage DestinationModal persisted', () => {
    // DestinationModal is persisted if FTU process is not completed
    cy.overrideTenantConfigWithFixture({ isContactInfoRequired: true });
    cy.mountNotifiSubscriptionCard();
    cy.overrideFetchDataTargetGroupWithFixture('notConfirmedTargetGroup.json');
    cy.overrideUserSettingsWithFixture('userSettingsFtuDestinations.json');

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      const tenantConfig = response.body.data.findTenantConfig;
      expect(tenantConfig.type).to.equal('SUBSCRIPTION_CARD');
    });

    cy.get('[data-cy="configDestinationModalNextButton"').should('exist');
  });
});
