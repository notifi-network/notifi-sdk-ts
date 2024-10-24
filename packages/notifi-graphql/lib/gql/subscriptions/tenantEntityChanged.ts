import { TenantUserAlertFragment } from '../fragments/TenantUserAlertFragment.gql';
import { TenantUserFragment } from '../fragments/TenantUserFragment.gql';

export const tenantEntityChangedSubscriptionQuery = `
${TenantUserAlertFragment}
${TenantUserFragment}

subscription {
  tenantEntityChanged {
    __typename
    ... on UserCreatedEvent {
      user {
        ...TenantUserFragment
      }
    }
    ... on AlertCreatedEvent {
      alert {
        ...TenantUserAlertFragment
      }
      user {
        ...TenantUserFragment
      }
    }
    ... on AlertDeletedEvent {
      alertId
      user {
        ...TenantUserFragment
      }
    }
  }
}
`;
