import {
  CardConfigItemV1,
  envUrl,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';

import { aliasMutation, aliasQuery, getTopicList } from '../utils';

describe('NotifiCardModal First Time User Test', () => {
  beforeEach(() => {
    cy.wait(2000); // To avoid "Too many login requests have been made" error
    const env = Cypress.env('ENV');
    cy.loadCSS();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'fetchFusionData');
    });

    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'beginLogInWithWeb3'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'completeLogInWithWeb3'),
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
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getEmailTargets'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getSmsTargets'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasQuery(req, 'getTelegramTargets'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createEmailTarget'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createSmsTarget'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'createTelegramTarget'),
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

      // NOTE: get component using css class as changing class name will cause breaking changes
      cy.get('.notifi-connect-footer-content').should('exist');
    });
  });

  it('FTU flow -isTargetRequired: FtuTargetList', () => {
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
      cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
      // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
      cy.wait('@gqlBeginLogInWithWeb3Mutation');
      cy.wait('@gqlCompleteLogInWithWeb3Mutation');
      cy.wait('@gqlFetchFusionDataQuery');
      // NOTE: Initial fetch after logging in. The following requests are triggered by the effect of frontendClientStatus.isAuthenticated (after logging in)
      cy.wait('@gqlGetUserSettingsQuery'); // --> NotifiUserSettingContext
      cy.wait('@gqlGetFusionNotificationHistoryQuery'); // --> NotifiHistoryContext
      cy.wait('@gqlGetUnreadNotificationHistoryCountQuery'); // --> NotifiHistoryContext
      cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
      cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext
      // NOTE: Ensure targets and subscribe topics (Note: targetGroup is auto created upon user creation)
      cy.wait('@gqlGetAlertsQuery'); // --> subscribe default alerts#1:  (in useConnect.ts --> ensureFusionAlerts)
      cy.wait('@gqlCreateFusionAlertsMutation'); // --> subscribe default alerts#2:  (in useConnect.ts --> ensureFusionAlerts)
      cy.wait('@gqlFetchFusionDataQuery'); // --> Update and render updated alerts after subscribing (ensureFusionAlerts.then)
      cy.wait('@gqlUpdateUserSettingsMutation'); // --> Update FTU stage to land on FtuTargetEdit.tsx

      // #2 - FTU Target List view (FtuTargetList.tsx)
      //   * Check wether all active contact info are correctly rendered
      const enabledContacts = objectKeys(cardConfig.contactInfo).filter(
        (contact) => cardConfig.contactInfo[contact].active,
      );
      cy.get('.notifi-target-list-item').should(
        'have.length',
        enabledContacts.length,
      );

      //  * Next button should be disabled
      cy.get('[data-cy="notifi-ftu-target-list-button"]')
        .should('exist')
        .should('be.disabled');

      for (const contact of enabledContacts) {
        if (contact === 'email' || contact === 'sms') {
          cy.get(
            `[data-cy="notifi-target-input-${
              contact === 'sms' ? 'phoneNumber' : contact
            }"]`,
          )
            .children('.notifi-target-input-field-input-container')
            .children('input')
            .type(
              contact === 'sms'
                ? '+18882378289' // Dummy test phone number
                : `tester-${contact}@notifi.network`,
            );
        }
      }

      // Signup the first target (Email)
      cy.get('.notifi-target-cta-button').eq(0).click();
      cy.wait('@gqlUpdateTargetGroupMutation'); // --> Update target group with new targets. In frontendClient.ensureTargetGroup()
      cy.wait('@gqlFetchFusionDataQuery'); // --> Refresh target data after ensuring targetGroup:  frontendClient.ensureTargetGroup().then(()=>fetchFusionData())

      // Click on Next button
      cy.get('[data-cy="notifi-ftu-target-list-button"]')
        .should('not.be.disabled')
        .click();
      cy.wait('@gqlUpdateUserSettingsMutation');
    });
  });

  it('FTU flow - isTargetNotRequired: FtuAlertEdit', () => {
    cy.mountCardModal(true);
    cy.overrideCardConfig({
      isContactInfoRequired: false,
    });
    cy.wait('@gqlFindTenantConfigQuery').then(() => {
      cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
      // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
      cy.wait('@gqlBeginLogInWithWeb3Mutation');
      cy.wait('@gqlCompleteLogInWithWeb3Mutation');
      cy.wait('@gqlFetchFusionDataQuery');
      // NOTE: Initial fetch after logging in. The following requests are triggered by the effect of frontendClientStatus.isAuthenticated (after logging in)
      cy.wait('@gqlGetUserSettingsQuery'); // --> NotifiUserSettingContext
      cy.wait('@gqlGetFusionNotificationHistoryQuery'); // --> NotifiHistoryContext
      cy.wait('@gqlGetUnreadNotificationHistoryCountQuery'); // --> NotifiHistoryContext
      cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
      cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext
      // NOTE: Ensure targets and subscribe topics (Note: targetGroup is auto created upon user creation)
      cy.wait('@gqlGetAlertsQuery'); // --> subscribe default alerts#1:  (in useConnect.ts --> ensureFusionAlerts)
      cy.wait('@gqlCreateFusionAlertsMutation'); // --> subscribe default alerts#2:  (in useConnect.ts --> ensureFusionAlerts)
      cy.wait('@gqlFetchFusionDataQuery'); // --> Update and render updated alerts after subscribing (ensureFusionAlerts.then)
      cy.wait('@gqlUpdateUserSettingsMutation'); // --> Update FTU stage to land on FtuTargetEdit.tsx
      // #2 - FTU Alert Edit view (FtuAlertEdit.tsx): Click on Next button, the following query should be made
      cy.get('[data-cy="notifi-ftu-alert-edit-button"]')
        .should('exist')
        .click();
      cy.wait('@gqlUpdateUserSettingsMutation');
    });
  });
});

describe('NotifiCardModal Inbox Test', () => {
  beforeEach(() => {
    cy.wait(2000); // To avoid "Too many login requests have been made" error
    const env = Cypress.env('ENV');
    cy.loadCSS();
    cy.clearNotifiStorage();
    cy.intercept('POST', envUrl(env), (req) => {
      aliasQuery(req, 'findTenantConfig');
    });
    // We do not put fetchFusionData here because we will need to override it
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'beginLogInWithWeb3'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'completeLogInWithWeb3'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'beginLogInWithWeb3'),
    );
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'completeLogInWithWeb3'),
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
    cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlBeginLogInWithWeb3Mutation');
    cy.wait('@gqlCompleteLogInWithWeb3Mutation');

    cy.wait('@gqlFetchFusionDataQuery');
    // NOTE: Initial fetch after logging in. The following requests are triggered by the effect of frontendClientStatus.isAuthenticated (after logging in)
    cy.wait('@gqlGetUserSettingsQuery'); // --> NotifiUserSettingContext
    cy.wait('@gqlGetFusionNotificationHistoryQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext
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
      .should('exist')
      .children('.notifi-history-list-main')
      .children('.notifi-history-row')
      .eq(0)
      .click();
    // #5: Confirm both history view & detail view are rendered
    cy.get('[data-cy="notifi-history-list"]').should('exist');
    cy.get('[data-cy="notifi-history-detail"]').should('exist');
  });

  it('INBOX flow - Config view: empty target', () => {
    // check whether can successfully find tenant config
    cy.mountCardModal();
    cy.overrideTargetGroup();
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlBeginLogInWithWeb3Mutation');
    cy.wait('@gqlCompleteLogInWithWeb3Mutation');
    cy.wait('@gqlFetchFusionDataQuery');
    // NOTE: Initial fetch after logging in. The following requests are triggered by the effect of frontendClientStatus.isAuthenticated (after logging in)
    cy.wait('@gqlGetUserSettingsQuery'); // --> NotifiUserSettingContext
    cy.wait('@gqlGetFusionNotificationHistoryQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext
    // #2 - Check if nav tabs exist & click on gear tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(1)
      .click();
    cy.get('.notifi-topic-list').should('exist');
    cy.get('.notifi-target-state-banner').should('exist').click();
    cy.get('.notifi-target-list-item').should('exist');
  });

  it('INBOX flow - Config view: with target', () => {
    cy.overrideTargetGroup(false);
    cy.mountCardModal();
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    // cy.wait('@gqlLogInFromDappMutation');
    cy.wait('@gqlBeginLogInWithWeb3Mutation');
    cy.wait('@gqlCompleteLogInWithWeb3Mutation');
    cy.wait('@gqlFetchFusionDataQuery');
    // NOTE: Initial fetch after logging in. The following requests are triggered by the effect of frontendClientStatus.isAuthenticated (after logging in)
    cy.wait('@gqlGetUserSettingsQuery'); // --> NotifiUserSettingContext
    cy.wait('@gqlGetFusionNotificationHistoryQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery'); // --> NotifiHistoryContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext
    // #2 - Check if nav tabs exist & click on gear tab
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(1)
      .click();
    cy.get('.notifi-target-state-banner-verify').should('exist');
  });
});
