import {
  ExecutionResult,
  Client as GraphqlWsClient,
  Sink as GraphqlWsSink,
} from 'graphql-ws';

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
  client: GraphqlWsClient,
  sink: GraphqlWsSink<ExecutionResult<TenantEntityUpdatedData>>,
) => {
  const unsubscribe = client.subscribe(
    {
      query: QUERY,
    },
    sink,
  );

  return unsubscribe;
};
