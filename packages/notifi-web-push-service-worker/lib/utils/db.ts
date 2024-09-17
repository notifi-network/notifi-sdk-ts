import { IndexedDb } from '../types';
import { notifiDb, notifiDefaultDbStore } from './constants';

export function createDb(): IndexedDb {
  let dbInstance: Promise<IDBDatabase>;

  function getDB() {
    if (dbInstance) return dbInstance;

    dbInstance = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(notifiDb);

      openreq.onerror = () => {
        reject(openreq.error);
      };

      openreq.onupgradeneeded = () => {
        // First time setup: create an empty object store
        openreq.result.createObjectStore(notifiDefaultDbStore);
      };

      openreq.onsuccess = () => {
        resolve(openreq.result);
      };
    });

    return dbInstance;
  }

  async function withStore(
    type: IDBTransactionMode,
    callback: (store: IDBObjectStore) => void,
  ): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(notifiDefaultDbStore, type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(notifiDefaultDbStore));
    });
  }

  return {
    async get(key: IDBValidKey): Promise<string | undefined> {
      return new Promise((resolve, reject) => {
        withStore('readonly', (store) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      });
    },
    set(key: IDBValidKey, value: string) {
      return withStore('readwrite', (store) => {
        store.put(value, key);
      });
    },
    delete(key: IDBValidKey) {
      return withStore('readwrite', (store) => {
        store.delete(key);
      });
    },
  };
}
