import { SubscriptionClient } from 'subscriptions-transport-ws';

import { TenantUser, TenantUserAlert } from '../types';

const QUERY = `
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

export type UserCreatedEvent = Readonly<{
  __typename: 'UserCreatedEvent';
  user: TenantUser;
}>;

export type AlertCreatedEvent = Readonly<{
  __typename: 'AlertCreatedEvent';
  user: TenantUser;
  alert: TenantUserAlert;
}>;

export type AlertDeletedEvent = Readonly<{
  __typename: 'AlertDeletedEvent';
  user: TenantUser;
  alertId: string;
}>;

export type TenantEntityUpdatedData =
  | UserCreatedEvent
  | AlertCreatedEvent
  | AlertDeletedEvent;

export const subscribeTenantEntityUpdated = (
  client: SubscriptionClient,
  onNext: (data: TenantEntityUpdatedData) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    client.request({ query: QUERY }).subscribe({
      next: (value) => {
        console.log('next', value);
        onNext(value as unknown as TenantEntityUpdatedData);
      },
      error: (err) => {
        console.log('error', err);
        reject(err);
      },
      complete: () => {
        console.log('complete');
        resolve();
      },
    });
  });
};
