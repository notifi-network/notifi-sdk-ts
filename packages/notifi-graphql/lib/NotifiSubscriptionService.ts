import {
  createClient,
  Client as WebSocketClient,
  SubscribePayload,
} from 'graphql-ws';
import { Observable, Subscription } from 'relay-runtime';
import { NotifiEventEmitter, NotifiEmitterEvents } from './NotifiEventEmitter';
import {
  stateChangedSubscriptionQuery,
  tenantEntityChangedSubscriptionQuery,
} from './gql';
import { StateChangedEvent, TenantEntityChangeEvent } from './gql/generated';

type SubscriptionQuery =
  | typeof tenantEntityChangedSubscriptionQuery
  | typeof stateChangedSubscriptionQuery;

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
      case 'tenantEntityChanged':
        return this._subscribe(tenantEntityChangedSubscriptionQuery);
      case 'stateChanged':
        return this._subscribe(stateChangedSubscriptionQuery);
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
          case tenantEntityChangedSubscriptionQuery:
            this.eventEmitter.emit(
              'tenantEntityChanged',
              data as TenantEntityChangeEvent,
            );
            break;
          case stateChangedSubscriptionQuery:
            this.eventEmitter.emit('stateChanged', data as StateChangedEvent);
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
