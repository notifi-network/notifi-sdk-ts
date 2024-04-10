import type {
  StateChangedSubscription,
  StateChangedSubscriptionVariables,
} from '../gql/generated';

export type StateChangedService = Readonly<{
  stateChanged: (
    variables: StateChangedSubscriptionVariables,
  ) => Promise<StateChangedSubscription>;
}>;