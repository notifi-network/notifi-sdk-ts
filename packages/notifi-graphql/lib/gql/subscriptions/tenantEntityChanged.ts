// TODO: Try import fragment from fragment file
export const tenantEntityChangedSubscriptionQuery = `
fragment TenantUserAlertFragment on TenantUserAlert {
  id
  name
  groupName
  filter {
    id
    name
    filterType
  }
  filterOptions
  sourceGroup {
    id
    name
    sources {
      id
      name
      type
      blockchainAddress
    }
  }
}

fragment TenantUserFragment on TenantUser {
  id
  alerts {
    ...TenantUserAlertFragment
  }
  connectedWallets {
    address
    walletBlockchain
  }
}

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
