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
      aliasQuery(req, 'findTenantConfig');
    });
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'fetchFusionData');
    });
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'logInFromDapp'),
    );
    cy.intercept('POST', envUrl(env), (req) => {
      aliasMutation(req, 'updateTargetGroup');
    });
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'updateUserSettings'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getUserSettings'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getFusionNotificationHistory'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getUnreadNotificationHistoryCount'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getTargetGroups'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createTargetGroup'),
    );
    cy.intercept('POST', envUrl(env), (req) => aliasQuery(req, 'getAlerts'));
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createFusionAlerts'),
    );
  });

  it('FTU flow - Connect view', () => {
    cy.mountCardModal(true);

    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      if (!response) throw new Error('FTU flow - Connect view: No response');
      // Check wether all topics are displayed
      const topicList = getTopicList(response);

      cy.get('[data-cy="notifi-connect-alert-list-container"]')
        .should('exist')
        .children()
        .should('have.length', topicList.length);
    });
  });

  it('FTU flow -isTargetRequired: FtuTargetEdit & FtuTargetList', () => {
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
      // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
      cy.wait('@gqlLogInFromDappMutation');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlGetUserSettingsQuery');
      cy.wait('@gqlGetFusionNotificationHistoryQuery');
      cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlFetchFusionDataQuery');

      // #2 - FTU Target Edit view (FtuTargetEdit.tsx)
      //   * Check wether all active contact info are displayed
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
      //   * Click on Next button: The following queries should be made
      cy.get('[data-cy="notifi-ftu-target-edit-button"]').click();
      cy.wait('@gqlGetTargetGroupsQuery');
      cy.wait('@gqlCreateTargetGroupMutation');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlGetAlertsQuery');
      cy.wait('@gqlCreateFusionAlertsMutation');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlUpdateTargetGroupMutation');

      // #3 - FTU Target List view (FtuTargetList.tsx)
      cy.get('[data-cy="notifi-ftu-target-list-button"]').click();
      //   * Click on Next button: The following query should be made
      cy.wait('@gqlUpdateUserSettingsMutation');
      cy.wait(2000); // Wait one sec to avoid hitting endpoint to often
    });
  });

  it('FTU flow - isTargetNotRequired: FtuAlertEdit', () => {
    cy.mountCardModal(true);
    cy.overrideCardConfig({
      isContactInfoRequired: false,
    });
    cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
      const tenantConfig = response?.body.data.findTenantConfig;

      const cardConfig = JSON.parse(tenantConfig.dataJson) as CardConfigItemV1;
      console.log({ cardConfig });
      cy.get('[data-cy="notifi-connect-button"]').click();
      // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
      cy.wait('@gqlLogInFromDappMutation');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlGetUserSettingsQuery');
      cy.wait('@gqlGetFusionNotificationHistoryQuery');
      cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
      cy.wait('@gqlFetchFusionDataQuery');
      cy.wait('@gqlFetchFusionDataQuery');

      // #2 - FTU Alert Edit view (FtuAlertEdit.tsx): Click on Next button, the following query should be made
      cy.get('[data-cy="notifi-ftu-alert-edit-button"]').click();
      cy.wait('@gqlUpdateUserSettingsMutation');
    });
  });
});

describe('NotifiCardModal Inbox Test', () => {
  beforeEach(() => {
    const env = Cypress.env('ENV');
    cy.loadCSS();
    cy.clearNotifiStorage();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    // We do not put fetchFusionData here because we will need to override it
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'logInFromDapp'),
    );
    cy.intercept('POST', envUrl(env), (req) => {
      aliasMutation(req, 'updateTargetGroup');
    });
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'updateUserSettings'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getUserSettings'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getFusionNotificationHistory'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getUnreadNotificationHistoryCount'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getTargetGroups'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createTargetGroup'),
    );
    cy.intercept('POST', envUrl(env), (req) => aliasQuery(req, 'getAlerts'));
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createFusionAlerts'),
    );
  });

  it('INBOX flow - History view', () => {
    const env = Cypress.env('ENV');
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'fetchFusionData');
    });
    cy.mountCardModal();
    cy.wait('@gqlFindTenantConfigQuery');
    cy.get('[data-cy="notifi-connect-button"]').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlLogInFromDappMutation');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlGetUserSettingsQuery');
    cy.wait('@gqlGetFusionNotificationHistoryQuery');
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    // #2 - Check if nav tabs exist & click on history tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(0)
      .click();
    // #3 - Confirm history view is rendered & detail view is not
    cy.get('[data-cy="notifi-history-list"]').should('exist');
    cy.get('[data-cy="notifi-history-detail"]').should('not.exist');

    // #4 - Click on a history item
    cy.get('[data-cy="notifi-history-list"]')
      .children('.notifi-history-list-main')
      .children('.notifi-history-row')
      .eq(0)
      .click();
    // #5: Confirm both history view & detail view are rendered
    cy.get('[data-cy="notifi-history-list"]').should('exist');
    cy.get('[data-cy="notifi-history-detail"]').should('exist');
    cy.wait(2000); // To avoid "Too many login requests have been made" error
  });

  it('INBOX flow - Config view: empty target', () => {
    // check whether can successfully find tenant config

    cy.mountCardModal();
    cy.overrideTargetGroup();
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlLogInFromDappMutation');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlGetUserSettingsQuery');
    cy.wait('@gqlGetFusionNotificationHistoryQuery');
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    // #2 - Check if nav tabs exist & click on gear tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(1)
      .click();
    cy.get('.notifi-topic-list').should('exist');
    cy.get('.notifi-target-state-banner').should('exist').click();
    cy.get('.notifi-inbox-config-target-edit-button-text').should('exist');
    cy.wait(2000); // To avoid "Too many login requests have been made" error
  });

  it('INBOX flow - Config view: with target', () => {
    cy.overrideTargetGroup(false);
    cy.mountCardModal();
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlLogInFromDappMutation');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlGetUserSettingsQuery');
    cy.wait('@gqlGetFusionNotificationHistoryQuery');
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    cy.wait('@gqlFetchFusionDataQuery');
    // #2 - Check if nav tabs exist & click on gear tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(1)
      .click();
    cy.get('.notifi-target-state-banner-verify').should('exist');
    cy.wait(2000); // To avoid "Too many login requests have been made" error
  });
});
