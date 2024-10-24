import {
  createClient,
  Client as WebSocketClient,
  SubscribePayload,
} from 'graphql-ws';
import { Observable } from 'relay-runtime';
import { NotifiEventEmitter, NotifiEmitterEvents } from './NotifiEventEmitter';

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

  addEventListener = <K extends keyof NotifiEmitterEvents>(
    event: K,
    callBack: (...args: NotifiEmitterEvents[K]) => void,
  ) => {
    return this.eventEmitter.on(event, callBack);
  };

  removeEventListener = <K extends keyof NotifiEmitterEvents>(
    event: K,
    callBack: (...args: NotifiEmitterEvents[K]) => void,
  ) => {
    return this.eventEmitter.off(event, callBack);
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
