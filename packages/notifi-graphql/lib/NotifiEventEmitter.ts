export type NotifiEmitterEvent = NotifiWebsocketEmitterEvent;

export type NotifiWebsocketEmitterEvent =
  | 'wsConnecting'
  | 'wsConnected'
  | 'wsClosed'
  | 'wsError';

// TODO: Refactor GQL subscription to use NotifiEventEmitter and add corresponding event types

export class NotifiEventEmitter<T extends Record<string, Array<any>>> {
  private _eventListeners: {
    [Key in keyof T]?: Array<(...args: T[Key]) => void>;
  } = {};

  on<U extends keyof T>(event: U, callback: (...args: T[U]) => void) {
    const callbacks = this._eventListeners[event] ?? [];
    callbacks.push(callback);
    this._eventListeners[event] = callbacks;
  }

  off<U extends keyof T>(event: U, callback: (...args: T[U]) => void) {
    const callbacks = this._eventListeners[event];
    if (callbacks && callbacks.length > 0) {
      const index = callbacks.indexOf(callback);
      const isIncluded = index !== -1;
      if (isIncluded) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit<U extends keyof T>(event: U, ...args: T[U]) {
    const callbacks = this._eventListeners[event];
    callbacks?.forEach((callback) => callback(...args));
  }
}
