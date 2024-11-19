import { Subscription } from 'relay-runtime';

import {
  StateChangedEvent,
  TenantActiveAlertChangeEvent,
} from './gql/generated';

export type NotifiEmitterEvents = NotifiSubscriptionEvents;

export type NotifiSubscriptionEvents = {
  tenantActiveAlertChanged: [TenantActiveAlertChangeEvent];
  stateChanged: [StateChangedEvent];
};

export type ListenerPayload<
  T extends Record<string, any[]>,
  K extends keyof T,
> = {
  callback: (...args: T[K]) => void;
  subscription: Subscription;
};

export class NotifiEventEmitter<T extends Record<string, Array<any>>> {
  private listeners: {
    [K in keyof T]?: Record<string, ListenerPayload<T, K>>;
  } = {};

  on<K extends keyof T>(
    event: K,
    listener: ListenerPayload<T, K>,
    id: string,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }
    (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[id] =
      listener;
    console.log('listened', { id, event, listeners: this.listeners });
  }

  off<K extends keyof T>(event: K, id: string): void {
    if (!this.listeners[event]?.[id]) return;
    (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[
      id
    ].subscription.unsubscribe();
    delete (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[id];
    console.log('removed', { id, event, listeners: this.listeners });
  }

  emit<K extends keyof T>(event: K, id: string, ...args: T[K]): void {
    if (!this.listeners[event]?.[id]) return;

    if (this.listeners[event]?.[id]) {
      (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[
        id
      ].callback(...args);
    }
    console.log('emitted', { id, event, listeners: this.listeners });
  }
}
