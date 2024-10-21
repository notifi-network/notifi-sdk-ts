import { Client as WebSocketClient } from 'graphql-ws';

export type NotifiEmitterEvents = {
  wsConnecting: [];
  wsConnected: [WebSocketClient];
  /* ⬇ The argument is actually the websocket `CloseEvent`, but to avoid bundling DOM typings because the client can run in Node env too, you should assert the websocket type during implementation.
   ** https://the-guild.dev/graphql/ws/docs/modules/client#eventclosedlistener
   */
  wsClosed: [unknown];
  wsError: [Error];
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
