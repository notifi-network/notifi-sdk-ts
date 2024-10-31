import {
  createClient,
  Client as WebSocketClient,
  SubscribePayload,
} from 'graphql-ws';
import { Observable, Subscription } from 'relay-runtime';
import {
  NotifiEventEmitter,
  NotifiEmitterEvents,
  NotifiSubscriptionEvents,
} from './NotifiEventEmitter';
import { stateChangedSubscriptionQuery } from './gql';
import { tenantActiveAlertChangedSubscriptionQuery } from './gql/subscriptions/tenantActiveAlertChanged.gql';

type SubscriptionQuery =
  | typeof stateChangedSubscriptionQuery
  | typeof tenantActiveAlertChangedSubscriptionQuery;

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
        console.log('Subscription complete');
        if (onComplete) {
          onComplete();
        }
      },
    });

    return subscription;
  };

  /**
   * @important for removing the event listener, check the guidelines in the NotifiEventEmitter (notifi-graphql/lib/NotifiEventEmitter.ts) class. https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-graphql/lib
   */
  addEventListener = <T extends keyof NotifiEmitterEvents>(
    event: T,
    callBack: (...args: NotifiEmitterEvents[T]) => void,
  ) => {
    this.eventEmitter.on(event, callBack);
    switch (event) {
      case 'stateChanged':
        return this._subscribe(stateChangedSubscriptionQuery);
      case 'tenantActiveAlertChanged':
        return this._subscribe(tenantActiveAlertChangedSubscriptionQuery);
      default:
        return null;
    }
  };

  removeEventListener = <T extends keyof NotifiEmitterEvents>(
    event: T,
    callBack: (...args: NotifiEmitterEvents[T]) => void,
  ) => {
    return this.eventEmitter.off(event, callBack);
  };

  /**
   * @returns null if jwt or wsClient is not correctly set
   */
  private _subscribe = (
    subscriptionQuery: SubscriptionQuery,
  ): Subscription | null => {
    if (!this._wsClient) {
      this._initializeClient();
    }

    if (!this._wsClient || !this._jwt) return null;

    console.log('Subscribing, JWT & wsClient are set'); // TODO: Remove before merge

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
            this.eventEmitter.emit('stateChanged', stateChangedData);
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
              tenantActiveAlertChangedData,
            );
            break;
          default:
            console.warn('Unknown subscription query:', subscriptionQuery);
        }
      },
      error: (error: unknown) => {
        this.eventEmitter.emit(
          'gqlSubscriptionError',
          error instanceof Error
            ? error
            : new Error('Unknown gql subscription error'),
        );
      },
      complete: () => this.eventEmitter.emit('gqlComplete'),
    });

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
    this._wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${this._jwt}`,
      },
      /* https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400 */
      webSocketImpl: this.webSocketImpl,
    });

    this._wsClient.on('connecting', () => {
      console.log('WebSocket connecting'); // TODO: Remove before merge
      this.eventEmitter.emit('wsConnecting');
    });

    this._wsClient.on('connected', () => {
      console.log('WebSocket connected'); // TODO: Remove before merge

      this.eventEmitter.emit('wsConnected', this._wsClient!);
    });

    this._wsClient.on('closed', (event) => {
      console.log(`WebSocket closed`); // TODO: Remove before merge

      this.eventEmitter.emit('wsClosed', event);
    });

    this._wsClient.on('error', (error) => {
      console.error('WebSocket error:', error); // TODO: Remove before merge
      if (error instanceof Error) {
        this.eventEmitter.emit('wsError', error);
      }
    });
  };
}

// Utils

const getSubscriptionData = <T extends keyof NotifiSubscriptionEvents>(
  subscriptionEvent: T,
  data: unknown,
) => {
  // NOTE: The raw data from the subscription is in the format { data: { subscriptionEvent: T } }
  if (typeof data !== 'object' || data === null) return null;
  if (!('data' in data)) return null;
  const subscriptionData = data.data;
  if (
    typeof subscriptionData === 'object' &&
    subscriptionData !== null &&
    subscriptionEvent in subscriptionData
  ) {
    return (subscriptionData as Record<keyof NotifiSubscriptionEvents, any>)[
      subscriptionEvent
    ] as NotifiSubscriptionEvents[T][0];
  }
  return null;
};
