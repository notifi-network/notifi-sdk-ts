import { ExecutionResult } from 'graphql';
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

const isKnownTypename = (typename: unknown): boolean => {
  return (
    typename === 'UserCreatedEvent' ||
    typename === 'AlertCreatedEvent' ||
    typename === 'AlertDeletedEvent'
  );
};

const hasKey = <K extends string>(
  obj: object,
  key: K,
): obj is object & { [k in K]: unknown } => {
  return typeof obj === 'object' && obj !== null && key in obj;
};

const assertKnownType = (data: unknown): data is TenantEntityUpdatedData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    hasKey(data, '__typename') &&
    isKnownTypename(data.__typename)
  );
};

const extractTenantEntityUpdate = (
  executionResult: ExecutionResult | undefined,
): TenantEntityUpdatedData | undefined => {
  const { data } = executionResult ?? {};
  if (typeof data === 'object' && data !== null) {
    const tenantEntityChanged = data.tenantEntityChanged;
    if (assertKnownType(tenantEntityChanged)) {
      return tenantEntityChanged;
    }
  }
};

export const subscribeTenantEntityUpdated = (
  client: SubscriptionClient,
  onNext: (data: TenantEntityUpdatedData) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    client.request({ query: QUERY }).subscribe({
      next: (executionResult) => {
        const update = extractTenantEntityUpdate(executionResult);
        if (update !== undefined) {
          onNext(update);
        }
      },
      error: (err) => {
        reject(err);
      },
      complete: () => {
        resolve();
      },
    });
  });
};
