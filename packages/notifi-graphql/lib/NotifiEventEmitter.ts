import {
  StateChangedEvent,
  TenantActiveAlertChangeEvent,
} from './gql/generated';

/** IMPORTANT: the guidelines to remove the event listener:
 * Calling removeEventListener will not unsubscribe the subscription.
 * Additionally, you need to call subscription.unsubscribe() to remove the subscription.
 */
export type NotifiEmitterEvents = NotifiSubscriptionEvents;

export type NotifiSubscriptionEvents = {
  tenantActiveAlertChanged: [TenantActiveAlertChangeEvent];
  stateChanged: [StateChangedEvent];
};

export type EventCallback<
  T extends Record<string, any[]>,
  K extends keyof T,
> = (...args: T[K]) => void;

export class NotifiEventEmitter<T extends Record<string, Array<any>>> {
  private listeners: { [K in keyof T]?: Record<string, EventCallback<T, K>> } =
    {};

  on<K extends keyof T>(
    event: K,
    listener: EventCallback<T, K>,
    id: string,
  ): void {
    console.log('listening', { id, event, listeners: this.listeners });
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }
    (this.listeners[event] as Record<string, EventCallback<T, K>>)[id] =
      listener;
  }

  off<K extends keyof T>(event: K, id: string): void {
    console.log('removing', { id, event, listeners: this.listeners });
    if (!this.listeners[event]?.[id]) return;

    delete (this.listeners[event] as Record<string, EventCallback<T, K>>)[id];
  }

  emit<K extends keyof T>(event: K, id: string, ...args: T[K]): void {
    if (!this.listeners[event]?.[id]) return;
    console.log('emitting', { id, event, listeners: this.listeners });
    if (this.listeners[event]?.[id]) {
      (this.listeners[event] as Record<string, EventCallback<T, K>>)[id](
        ...args,
      );
    }
  }
}
