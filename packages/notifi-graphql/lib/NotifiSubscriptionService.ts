import {
  SubscribePayload,
  Client as WebSocketClient,
  createClient,
} from 'graphql-ws';
import { Observable, Subscription } from 'relay-runtime';

import {
  NotifiEmitterEvents,
  NotifiEventEmitter,
  NotifiSubscriptionEvents,
} from './NotifiEventEmitter';
import { stateChangedSubscriptionQuery } from './gql';
import { tenantActiveAlertChangedSubscriptionQuery } from './gql/subscriptions/tenantActiveAlertChanged.gql';

export type SubscriptionQuery =
  | typeof stateChangedSubscriptionQuery
  | typeof tenantActiveAlertChangedSubscriptionQuery;

export type SubscribeInputs = {
  subscriptionQuery: SubscriptionQuery;
  id: string;
  onError?: (error: unknown) => void;
  onComplete?: () => void;
};

type _Subscribe = (input: SubscribeInputs) => Subscription | null;

/**
 * @param webSocketImpl - A custom WebSocket implementation to use instead of the one provided by the global scope. Mostly useful for when using the client outside of the browser environment.
 * @ref https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400
 */
export class NotifiSubscriptionService {
  private _wsClient: WebSocketClient | undefined;
  private _jwt: string | undefined;
  private eventEmitter = new NotifiEventEmitter<NotifiEmitterEvents>();
  constructor(
    private wsurl: string,
    private webSocketImpl?: unknown,
  ) {}

  setJwt = (jwt: string | undefined) => {
    this._jwt = jwt;
  };

  /**
   * @deprecated Should not directly manipulate the websocket client. Instead use the returned subscription object to manage the subscription. ex. subscription.unsubscribe()
   */
  disposeClient = () => {
    if (this._wsClient) {
      this._jwt = undefined;
      this._wsClient.terminate();
      this._wsClient.dispose();
    }
  };
  /**
   * @deprecated Use addEventListener instead
   */
  subscribe = (
    jwt: string | undefined,
    subscriptionQuery: string,
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ) => {
    this._jwt = jwt;

    if (!this._wsClient) {
      this._initializeClient();
    }
    if (!this._wsClient) return null;

    const observable = this._toObservable(this._wsClient, {
      query: subscriptionQuery,
      extensions: {
        type: 'start',
      },
    });

    const subscription = observable.subscribe({
      next: (data) => {
        if (onMessageReceived) {
          onMessageReceived(data);
        }
      },
      error: (error: unknown) => {
        if (onError && error instanceof Error) {
          onError(error);
        }
      },
      complete: () => {
        if (onComplete) {
          onComplete();
        }
      },
    });

    return subscription;
  };

  /**
   * @returns {string} - The id of the event listener (used to remove the event listener)
   */
  addEventListener = <T extends keyof NotifiEmitterEvents>(
    event: T,
    callback: (...args: NotifiEmitterEvents[T]) => void,
    onError?: (error: unknown) => void,
    onComplete?: () => void,
  ): string => {
    const id = Math.random().toString(36).slice(2, 11); // ⬅ Generate a random id for the listener
    const subscribeInputs: SubscribeInputs = {
      subscriptionQuery: '' as SubscriptionQuery, // ⬅ Placeholder (empty string intentionally)
      id,
      onError,
      onComplete,
    };

    switch (event) {
      case 'stateChanged':
        subscribeInputs.subscriptionQuery = stateChangedSubscriptionQuery;
        break;
      case 'tenantActiveAlertChanged':
        subscribeInputs.subscriptionQuery =
          tenantActiveAlertChangedSubscriptionQuery;
        break;
      default:
        throw new Error('Unknown event');
    }

    const subscription = this._subscribe(subscribeInputs);
    if (!subscription)
      throw new Error(
        'NotifiSubscriptionService.addEventListener: Subscription failed',
      );

    this.eventEmitter.on(event, { callback, subscription }, id);

    return id;
  };

  removeEventListener = <T extends keyof NotifiEmitterEvents>(
    event: T,
    id: string,
  ) => {
    return this.eventEmitter.off(event, id);
  };

  /**
   * @returns null if jwt or wsClient is not correctly set
   */
  private _subscribe: _Subscribe = ({
    subscriptionQuery,
    id,
    onError,
    onComplete,
  }) => {
    if (!this._wsClient) {
      this._initializeClient();
    }

    if (!this._wsClient || !this._jwt) return null;

    const observable = this._toObservable(this._wsClient, {
      query: subscriptionQuery,
      extensions: {
        type: 'start',
      },
    });

    const subscription = observable.subscribe({
      next: (data) => {
        switch (subscriptionQuery) {
          case stateChangedSubscriptionQuery:
            const stateChangedData = getSubscriptionData('stateChanged', data);
            if (!stateChangedData) {
              throw new Error('Invalid stateChanged event data');
            }
            this.eventEmitter.emit('stateChanged', id, stateChangedData);
            break;
          case tenantActiveAlertChangedSubscriptionQuery:
            const tenantActiveAlertChangedData = getSubscriptionData(
              'tenantActiveAlertChanged',
              data,
            );
            if (!tenantActiveAlertChangedData) {
              throw new Error('Invalid tenantActiveAlertChanged event data');
            }
            this.eventEmitter.emit(
              'tenantActiveAlertChanged',
              id,
              tenantActiveAlertChangedData,
            );
            break;
          default:
            console.warn('Unknown subscription query:', subscriptionQuery);
        }
      },
      error: onError,
      complete: onComplete,
    });

    console.log('Subscribed', subscription); // TODO: Remove before merge

    return subscription;
  };

  private _toObservable(client: WebSocketClient, operation: SubscribePayload) {
    return Observable.create((observer) =>
      client.subscribe(operation, {
        next: (data) => observer.next(data),
        error: (err) => {
          if (err instanceof Error) {
            observer.error(err);
          }
        },
        complete: () => observer.complete(),
      }),
    );
  }

  private _initializeClient = () => {
    if (!this._jwt)
      throw new Error(
        'NotifiSubscriptionService._initializeClient: Missing JWT',
      );

    this._wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${this._jwt}`,
      },
      /* https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400 */
      webSocketImpl: this.webSocketImpl,
    });

    /** ⬇ Uncomment to monitor websocket behavior (debugging purpose) */
    // this._wsClient.on('connecting', () => {
    //   console.info(
    //     'NotifiSubscriptionService._initializeClient:  Connecting to ws',
    //   );
    // });

    // this._wsClient.on('connected', () => {
    //   console.info(
    //     'NotifiSubscriptionService._initializeClient:  Connected to ws',
    //   );
    // });

    // this._wsClient.on('closed', (event) => {
    //   console.info(
    //     'NotifiSubscriptionService._initializeClient:  Closed ws',
    //     event,
    //   );
    // });

    // this._wsClient.on('error', (error) => {
    //   console.error(
    //     'NotifiSubscriptionService._initializeClient: Websocket Error:',
    //     error,
    //   );
    // });
  };
}

// Utils

// NOTE: GraphQL Subscription Event Response Format: https://spec.graphql.org/October2021/#sec-Response-Format
type GqlSubscriptionEventData<T extends keyof NotifiSubscriptionEvents> = {
  data: Record<T, NotifiSubscriptionEvents[T][0]>;
};

const getSubscriptionData = <T extends keyof NotifiSubscriptionEvents>(
  subscriptionEvent: T,
  subscriptionEventData: unknown,
) => {
  if (
    typeof subscriptionEventData !== 'object' ||
    subscriptionEventData === null
  )
    return null;

  if (!('data' in subscriptionEventData)) return null;

  const { data: eventPayload } =
    subscriptionEventData as GqlSubscriptionEventData<T>;

  if (
    typeof eventPayload === 'object' &&
    eventPayload !== null &&
    subscriptionEvent in eventPayload
  ) {
    return eventPayload[subscriptionEvent];
  }
  return null;
};
