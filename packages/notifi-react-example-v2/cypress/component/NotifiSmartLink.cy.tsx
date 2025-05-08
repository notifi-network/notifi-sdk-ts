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
    // TO BE IMPLEMENTED
  });
});
