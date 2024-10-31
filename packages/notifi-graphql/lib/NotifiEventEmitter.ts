import { Client as WebSocketClient } from 'graphql-ws';
import {
  StateChangedEvent,
  TenantEntityChangeEvent,
  TenantActiveAlertChangeEvent,
} from './gql/generated';

/** IMPORTANT: the guidelines to remove the event listener:
 * 1. For status events (NotifiWebSocketStatusEvents or NotifiSubscriptionStatusEvents), calling removeEventListener will remove the listener.
 * 2. For graphql subscription events (NotifiSubscriptionEvents), calling removeEventListener will not unsubscribe the subscription. additionally, you need to call subscription.unsubscribe() to remove the subscription.
 */
export type NotifiEmitterEvents = NotifiWebSocketStatusEvents &
  NotifiSubscriptionEvents &
  NotifiSubscriptionStatusEvents;

type NotifiWebSocketStatusEvents = {
  wsConnecting: [];
  wsConnected: [WebSocketClient];
  wsClosed: [unknown]; // ⬅ The argument is actually the websocket `CloseEvent`, but to avoid bundling DOM typings because the client can run in Node env too, you should assert the websocket type during implementation. https://the-guild.dev/graphql/ws/docs/modules/client#eventclosedlistener
  wsError: [Error];
};

type NotifiSubscriptionStatusEvents = {
  gqlSubscriptionError: [Error];
  gqlComplete: [];
};

type NotifiSubscriptionEvents = {
  // TODO: Deprecate this event
  tenantEntityChanged: [TenantEntityChangeEvent];
  tenantActiveAlertChanged: [TenantActiveAlertChangeEvent];
  stateChanged: [StateChangedEvent];
};

export type EventCallback<
  T extends Record<string, any[]>,
  K extends keyof T,
> = (...args: T[K]) => void;

export class NotifiEventEmitter<T extends Record<string, Array<any>>> {
  private listeners: { [K in keyof T]?: Array<EventCallback<T, K>> } = {};

  on<K extends keyof T>(event: K, listener: EventCallback<T, K>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof T>(event: K, listener: EventCallback<T, K>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(
      (l) => l !== listener,
    );
  }

  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    if (!this.listeners[event]) return;
    for (const listener of this.listeners[event]!) {
      listener(...args);
    }
  }
}
