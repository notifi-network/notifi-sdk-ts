import { createClient, Client, SubscribePayload, Event } from 'graphql-ws';
import { Observable } from 'relay-runtime';
import {
  NotifiEventEmitter,
  NotifiWebsocketEmitterEvent,
} from './NotifiEventEmitter';

/**
 * @param webSocketImpl - A custom WebSocket implementation to use instead of the one provided by the global scope. Mostly useful for when using the client outside of the browser environment.
 * @ref https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400
 */
export class NotifiSubscriptionService {
  private wsClient: Client | undefined;
  private jwt: string | undefined;
  private eventEmitter = new NotifiEventEmitter<
    Record<NotifiWebsocketEmitterEvent, Array<any>>
  >();
  constructor(
    private wsurl: string,
    private webSocketImpl?: unknown,
  ) {}

  disposeClient = () => {
    if (this.wsClient) {
      this.jwt = undefined;
      this.wsClient.terminate();
      this.wsClient.dispose();
    }
  };

  subscribe = (
    jwt: string | undefined,
    subscriptionQuery: string,
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ) => {
    this.jwt = jwt;

    if (!this.wsClient) {
      this._initializeClient();
    }
    if (!this.wsClient) return null;

    const observable = this._toObservable(this.wsClient, {
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

  addEventListener = (
    event: NotifiWebsocketEmitterEvent,
    callBack: () => void,
  ) => {
    return this.eventEmitter.on(event, callBack);
  };

  removeEventListener = (
    event: NotifiWebsocketEmitterEvent,
    callBack: () => void,
  ) => {
    return this.eventEmitter.off(event, callBack);
  };

  private _toObservable(client: Client, operation: SubscribePayload) {
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
    this.wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${this.jwt}`,
      },
      /* https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400 */
      webSocketImpl: this.webSocketImpl,
    });

    this.wsClient.on('connecting', () => {
      console.log('WebSocket connecting'); // TODO: Remove before merge
      this.eventEmitter.emit('wsConnecting');
    });

    this.wsClient.on('connected', () => {
      console.log('WebSocket connected'); // TODO: Remove before merge
      this.eventEmitter.emit('wsConnected');
    });

    this.wsClient.on('closed', (event) => {
      console.log(`WebSocket closed: ${JSON.stringify(event)}`); // TODO: Remove before merge
      this.eventEmitter.emit('wsClosed', event);
    });

    this.wsClient.on('error', (error) => {
      console.error('WebSocket error:', error); // TODO: Remove before merge
      this.eventEmitter.emit('wsError', error);
    });
  };
}
