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
  T extends Record<string, unknown[]>,
  K extends keyof T,
> = {
  callback: (...args: T[K]) => void;
  subscription: Subscription;
};

export class NotifiEventEmitter<T extends Record<string, Array<unknown>>> {
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
    (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[id] = // ⬅ Workaround for TS limitation (not able to infer that this.listeners[event] is defined)
      listener;
  }

  off<K extends keyof T>(event: K, id: string): void {
    if (!this.listeners[event]?.[id]) return;
    (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[ // ⬅ Workaround for TS limitation (not able to infer that this.listeners[event] is defined)
      id
    ].subscription
      .unsubscribe();
    delete (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[id]; // ⬅ Workaround for TS limitation (not able to infer that this.listeners[event] is defined)
  }

  emit<K extends keyof T>(event: K, id: string, ...args: T[K]): void {
    if (!this.listeners[event]?.[id]) return;

    if (this.listeners[event]?.[id]) {
      (this.listeners[event] as Record<string, ListenerPayload<T, K>>)[id] // ⬅ Workaround for TS limitation (not able to infer that this.listeners[event] is defined)
        .callback(...args);
    }
  }
}
