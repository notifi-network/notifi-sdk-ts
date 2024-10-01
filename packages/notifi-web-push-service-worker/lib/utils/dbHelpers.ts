import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

import { IndexedDb } from '../types';
import {
  notifiDappIdKey,
  notifiEnvKey,
  notifiUserAccountKey,
} from './constants';

export async function storeNotifiEnv(db: IndexedDb, env: NotifiEnvironment) {
  await db.set(notifiEnvKey, env);
}

export async function storeNotifiUserAccount(
  db: IndexedDb,
  userAccount: string,
) {
  await db.set(notifiUserAccountKey, userAccount);
}

export async function storeNotifiDappId(db: IndexedDb, dappId: string) {
  await db.set(notifiDappIdKey, dappId);
}

export async function getNotifiEnv(db: IndexedDb): Promise<string | undefined> {
  return await db.get(notifiEnvKey);
}

export async function getNotifiUserAccount(
  db: IndexedDb,
): Promise<string | undefined> {
  return await db.get(notifiUserAccountKey);
}

export async function getNotifiDappId(
  db: IndexedDb,
): Promise<string | undefined> {
  return await db.get(notifiDappIdKey);
}
