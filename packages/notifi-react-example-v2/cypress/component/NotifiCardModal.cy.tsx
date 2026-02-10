import {
  CardConfigItemV1,
  envUrl,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';

import {
  aliasMutation,
  aliasQuery,
  getTopicList,
  hasOperationName,
} from '../utils';

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
    cy.intercept('POST', envUrl(env), (req) =>
      aliasMutation(req, 'deleteTelegramTarget'),
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

  it('INBOX flow - Config view: remove telegram target', () => {
    const env = Cypress.env('ENV');

    // Define target data for consistent mocking
    // Using SMS + Telegram combination (not Email) to avoid sedning additional verification requestion by new email registration
    const telegramTarget = {
      id: 'telegram-target-id-123',
      isConfirmed: true,
      name: 'Default',
      telegramId: '@testuser',
    };
    const smsTarget = {
      id: 'sms-target-id-456',
      isConfirmed: true,
      name: 'Default',
      phoneNumber: '+12025551234',
    };
    const dummyTargetGroup = {
      id: 'target-group-id',
      name: 'Default',
      emailTargets: [],
      smsTargets: [smsTarget],
      telegramTargets: [telegramTarget],
      discordTargets: [],
      slackChannelTargets: [],
      web3Targets: [],
    };

    // Override targetGroup with sms and telegram targets - MUST call before mountCardModal
    // so that intercept is registered before any requests are made
    // NOTE: Need at least 2 verified targets for Remove button to be available
    // (due to hasValidTargetMoreThan(targetData, 1) check in useTargetListItem.tsx)
    cy.overrideTargetGroup({
      smsTargets: [smsTarget],
      telegramTargets: [telegramTarget],
    });
    // Override cardConfig to enable sms and telegram - MUST call before mountCardModal
    cy.overrideCardConfig({
      contactInfo: {
        email: { active: false },
        sms: { active: true },
        telegram: { active: true },
        discord: { active: false },
        slack: { active: false },
      },
    });

    // IMPORTANT: Register this intercept AFTER overrideTargetGroup so it has higher priority
    // This single intercept handles all the GraphQL operations needed for delete flow
    cy.intercept('POST', envUrl(env), (req) => {
      // Mock fetchFusionData - returns the target group with telegram and sms targets
      // This intercept has higher priority than overrideTargetGroup's intercept
      if (hasOperationName(req, 'fetchFusionData')) {
        aliasQuery(req, 'fetchFusionData');
        req.reply({
          data: {
            targetGroup: [dummyTargetGroup],
            alerts: [],
            connectedWallets: [],
          },
        });
        return;
      }

      // Mock getTargetGroups - returns the target group with telegram and sms targets
      if (hasOperationName(req, 'getTargetGroups')) {
        req.alias = 'gqlGetTargetGroupsQuery';
        req.reply({
          data: {
            targetGroup: [dummyTargetGroup],
          },
        });
        return;
      }

      // Mock getTelegramTargets - returns the telegram target (needed for delete check)
      if (hasOperationName(req, 'getTelegramTargets')) {
        req.alias = 'gqlGetTelegramTargetsQuery';
        req.reply({
          data: {
            telegramTarget: [telegramTarget],
          },
        });
        return;
      }

      // Mock getSmsTargets - returns the sms target
      if (hasOperationName(req, 'getSmsTargets')) {
        req.alias = 'gqlGetSmsTargetsQuery';
        req.reply({
          data: {
            smsTarget: [smsTarget],
          },
        });
        return;
      }

      // Mock updateTargetGroup - returns the updated target group (without telegram)
      if (hasOperationName(req, 'updateTargetGroup')) {
        req.alias = 'gqlUpdateTargetGroupMutation';
        req.reply({
          data: {
            updateTargetGroup: {
              ...dummyTargetGroup,
              telegramTargets: [], // Telegram removed
            },
          },
        });
        return;
      }

      // Mock deleteTelegramTarget - returns the deleted target
      if (hasOperationName(req, 'deleteTelegramTarget')) {
        req.alias = 'gqlDeleteTelegramTargetMutation';
        req.reply({
          data: {
            deleteTelegramTarget: telegramTarget,
          },
        });
        return;
      }
    });

    cy.mountCardModal();
    cy.wait('@gqlFindTenantConfigQuery');

    cy.get('[data-cy="notifi-connect-button"]').should('exist').click();
    // #1 - Connect view (Connect.tsx): Click on connect button, the following queries should be made
    cy.wait('@gqlBeginLogInWithWeb3Mutation');
    cy.wait('@gqlCompleteLogInWithWeb3Mutation');
    cy.wait('@gqlFetchFusionDataQuery');
    // NOTE: Initial fetch after logging in
    cy.wait('@gqlGetUserSettingsQuery');
    cy.wait('@gqlGetFusionNotificationHistoryQuery');
    cy.wait('@gqlGetUnreadNotificationHistoryCountQuery');
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTargetContext
    cy.wait('@gqlFetchFusionDataQuery'); // --> NotifiTopicContext

    // #2 - Navigate to Config view (gear tab) and expand target list
    cy.get('[data-cy="notifi-inbox-nav-tabs"]')
      .should('exist')
      .children('div')
      .eq(1)
      .click();
    cy.get('.notifi-topic-list').should('exist');
    cy.get('.notifi-target-state-banner:visible').should('exist').click();

    // #3 - Click Remove button on telegram target
    // Wait for target list to be fully rendered with correct data
    cy.get('.notifi-target-list-item').should('exist');

    // Wait for telegram target to show its username (indicates data is loaded)
    cy.contains('@testuser').should('exist');

    // Find the telegram target list item and click its Remove button
    // The telegram target item should contain '@testuser'
    cy.contains('.notifi-target-list-item', '@testuser')
      .find('.notifi-target-list-item-remove')
      .click();

    // Wait for the alterTargetGroup flow to start
    // The flow is: getTargetGroups -> (get*Targets for non-remove targets) -> (updateTargetGroup if needed) -> deleteTelegramTarget
    // NOTE: Only targets with type 'ensure' or 'delete' will call get*Targets
    // - email: empty -> 'remove' -> NO query
    // - phoneNumber: has value -> 'ensure' -> calls getSmsTargets
    // - telegram: delete operation -> 'delete' -> calls getTelegramTargets
    // - discord: false -> 'remove' -> NO query
    // - slack: false -> 'remove' -> NO query
    // - wallet: false -> 'remove' -> NO query
    cy.wait('@gqlGetTargetGroupsQuery');
    cy.wait('@gqlGetSmsTargetsQuery');
    cy.wait('@gqlGetTelegramTargetsQuery');

    // Note: updateTargetGroup may or may not be called depending on areIdsEqual check
    // If all target IDs match, it skips updateTargetGroup and goes directly to delete
    // For now, we just wait for deleteTelegramTarget directly

    // #4 - Verify deleteTelegramTarget mutation was called with correct targetId
    cy.wait('@gqlDeleteTelegramTargetMutation', { timeout: 30000 }).then(
      ({ request }) => {
        expect(request.body.variables).to.have.property('id');
        expect(request.body.variables.id).to.equal('telegram-target-id-123');
      },
    );
  });
});
