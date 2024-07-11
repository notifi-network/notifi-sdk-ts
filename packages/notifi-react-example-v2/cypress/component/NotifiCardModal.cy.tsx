import { envUrl } from '@notifi-network/notifi-frontend-client';

import { aliasQuery } from '../utils';

describe('NotifiCardModal Component test', () => {
  beforeEach(() => {
    // const env = Cypress.env('ENV');
    // cy.loadCSS();
    // cy.intercept('POST', envUrl(env), (req) => {
    //   aliasQuery(req, 'fetchData');
    // });
  });

  it('Connect view', () => {
    // check whether can successfully find tenant config
    const env = Cypress.env('ENV');
    // cy.clearNotifiStorage();
    // cy.mountCardModal();
    // cy.intercept('POST', envUrl(env), (req) => {
    //   aliasQuery(req, 'findTenantConfig');
    // });
    // cy.wait('@gqlFindTenantConfigQuery').then(({ response }) => {
    //   expect(response?.statusCode).to.equal(200);
    // });
  });
});
