import {
  CardConfigItemV1,
  envUrl,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';

import { aliasMutation, aliasQuery, getTopicList } from '../utils';

describe('NotifiCardModal First Time User Test', () => {
  beforeEach(() => {
    const env = Cypress.env('ENV');
    cy.loadCSS();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'fetchData');
    });
  });

  it('FTU flow - FtuAlertList', () => {
    const env = Cypress.env('ENV');
    cy.mountCardModal(true);

    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    cy.get('[data-cy="notifi-connect-button"]').click();
    // FtuAlertList
    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      // Check wether all topics are displayed
      const topicList = getTopicList(response);

      cy.get('[data-cy="notifi-ftu-alert-list-container"]')
        .should('exist')
        .children()
        .should('have.length', topicList.length);
    });

    /** Wait until all requests done before next test */
    cy.wait('@gqlFetchDataQuery'); // Connect.tsx (Check targetGroup status)
    cy.wait('@gqlFetchDataQuery'); // NotifiTargetContext (frontendClientStatus -> isAuthenticated)
    cy.wait('@gqlFetchDataQuery'); // NotifiTopicContext (frontendClientStatus -> isAuthenticated)
    cy.wait('@gqlFetchDataQuery'); // NotifiTopicContext (subscribeAlertsDefault)
  });

  it('FTU flow -isTargetRequired: FtuTargetEdit & FtuTargetList', () => {
    const env = Cypress.env('ENV');
    cy.mountCardModal(true);
    cy.overrideCardConfig({
      isContactInfoRequired: true,
      contactInfo: {
        email: {
          active: true,
        },
        sms: { active: true },
        telegram: { active: true },
        discord: { active: true },
        slack: { active: true },
      },
    });
    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      const tenantConfig = response?.body.data.findTenantConfig;

      const cardConfig = JSON.parse(tenantConfig.dataJson) as CardConfigItemV1;
      console.log({ cardConfig });
      cy.get('[data-cy="notifi-connect-button"]').click();
      // Wait until login request done (refer to FtuFlow test for more detail)
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait(1000); // Wait one sec to avoid hitting endpoint to often

      cy.get('[data-cy="notifi-ftu-alert-list-button"]').click();

      cy.intercept('POST', envUrl(env), (req) => {
        aliasMutation(req, 'updateUserSettings');
      });
      cy.wait('@gqlUpdateUserSettingsMutation');

      // Check wether all active contact info are displayed
      const supportedContact = objectKeys(cardConfig.contactInfo);
      for (const contact of supportedContact) {
        if (cardConfig.contactInfo[contact].active) {
          cy.get(
            `[data-cy="notifi-target-input-${
              contact === 'sms' ? 'phoneNumber' : contact
            }"]`,
          ).should('exist');
          if (
            contact === 'email' ||
            contact === 'sms' ||
            contact === 'telegram'
          ) {
            cy.get(
              `[data-cy="notifi-target-input-${
                contact === 'sms' ? 'phoneNumber' : contact
              }"]`,
            )
              .children('.notifi-target-input-field-input-container')
              .children('input')
              .type(`tester-${contact}@notifi.network`);
          }
          // TODO: implement toggle type
        }
      }
      cy.get('[data-cy="notifi-ftu-target-edit-button"]').click();
      cy.intercept('POST', envUrl(env), (req) => {
        aliasMutation(req, 'updateTargetGroup');
      });
      cy.wait('@gqlUpdateTargetGroupMutation').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.get('[data-cy="notifi-ftu-target-list-button"]').click();
      cy.intercept('POST', envUrl(env), (req) =>
        aliasMutation(req, 'updateUserSettings'),
      );
      cy.wait('@gqlUpdateUserSettingsMutation').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
    });
  });

  it('FTU flow - isTargetNotRequired: FtuAlertEdit', () => {
    const env = Cypress.env('ENV');
    cy.mountCardModal(true);
    cy.overrideCardConfig({
      isContactInfoRequired: false,
    });
    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      const tenantConfig = response?.body.data.findTenantConfig;

      const cardConfig = JSON.parse(tenantConfig.dataJson) as CardConfigItemV1;
      console.log({ cardConfig });
      cy.get('[data-cy="notifi-connect-button"]').click();
      // Wait until login request done (refer to FtuFlow test for more detail)
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait('@gqlFetchDataQuery');
      cy.wait(1000); // Wait one sec to avoid hitting endpoint to often

      cy.get('[data-cy="notifi-ftu-alert-list-button"]').click();

      cy.intercept('POST', envUrl(env), (req) => {
        aliasMutation(req, 'updateUserSettings');
      });
      cy.wait('@gqlUpdateUserSettingsMutation');
      cy.get('[data-cy="notifi-ftu-alert-edit-button"]').click();
      cy.intercept('POST', envUrl(env), (req) =>
        aliasMutation(req, 'updateUserSettings'),
      );
      cy.wait('@gqlUpdateUserSettingsMutation').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
    });
  });
});

describe('NotifiCardModal Inbox Test', () => {
  beforeEach(() => {
    const env = Cypress.env('ENV');
    cy.loadCSS();
    cy.clearNotifiStorage();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'fetchData');
      aliasMutation(req, 'logInFromDapp');
    });
  });

  it('INBOX flow - History view', () => {
    // check whether can successfully find tenant config
    const env = Cypress.env('ENV');
    cy.mountCardModal();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    cy.wait('@gqlFindTenantConfigQuery');
    cy.get('[data-cy="notifi-connect-button"]').click();
    cy.wait('@gqlFetchDataQuery');
    // Check if nav tabs exist & click on history tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(0)
      .click();
    // Confirm history view is rendered & detail view is not
    cy.get('[data-cy="notifi-history-list"]').should('exist');
    cy.get('[data-cy="notifi-history-detail"]').should('not.exist');

    // Click on a history item
    cy.get('[data-cy="notifi-history-list"]')
      .children('.notifi-history-list-main')
      .children('.notifi-history-row')
      .eq(0)
      .click();
    // Confirm both history view & detail view are rendered
    cy.get('[data-cy="notifi-history-list"]').should('exist');
    cy.get('[data-cy="notifi-history-detail"]').should('exist');
  });

  it.only('INBOX flow - Config view: empty target', () => {
    // check whether can successfully find tenant config
    const env = Cypress.env('ENV');
    cy.overrideTargetGroup();
    cy.mountCardModal();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').click();
    cy.wait('@gqlLogInFromDappMutation');

    cy.wait('@gqlFetchDataQuery').then(({ response }) => {
      console.log({ response });
      cy.get('[data-cy="notifi-inbox-nav-tabs"]')
        .should('exist')
        .children('div')
        .eq(1)
        .click();
      cy.get('.notifi-topic-list').should('exist');
      cy.get('.notifi-target-state-banner-signup-cta').should('exist').click();
      cy.get('.notifi-inbox-config-target-edit-button-text').should('exist');
    });
  });

  it('INBOX flow - Config view: with target', () => {
    // check whether can successfully find tenant config
    const env = Cypress.env('ENV');
    cy.overrideTargetGroup(false);
    cy.mountCardModal();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').click();
    cy.wait('@gqlLogInFromDappMutation');

    cy.wait('@gqlFetchDataQuery').then(({ response }) => {
      console.log({ response });
      cy.get('[data-cy="notifi-inbox-nav-tabs"]')
        .should('exist')
        .children('div')
        .eq(1)
        .click();
      cy.get('.notifi-target-state-banner-verify').should('exist').click();
      cy.get('.notifi-inbox-config-target-list-button-text')
        .should('exist')
        .click();
      cy.get('.notifi-inbox-config-target-edit-button').should('exist');
    });
  });
});
