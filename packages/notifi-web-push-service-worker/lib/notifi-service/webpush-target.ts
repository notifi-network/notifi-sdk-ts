import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';

import { IndexedDb } from '../types';
import { uint8ArrayToBase64Url, webPushTargetIdKey } from '../utils';

export async function createOrUpdateWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
  db: IndexedDb,
  frontendClient: NotifiFrontendClient,
): Promise<void> {
  const webPushTargetId = await db.get(webPushTargetIdKey);
  if (!webPushTargetId || webPushTargetId === '') {
    await createWebPushTarget(subscription, vapidPublicKey, frontendClient, db);
    return;
  }

  const getWebPushTargetsResponse = await frontendClient.getWebPushTargets({
    ids: [webPushTargetId],
  });

  // NOTE: cannot find existing web push target, create a new one
  if (
    !getWebPushTargetsResponse?.nodes ||
    getWebPushTargetsResponse?.nodes?.length === 0
  ) {
    await createWebPushTarget(subscription, vapidPublicKey, frontendClient, db);
    return;
  }

  // NOTE: found existing web push target, update it
  await updateWebPushTarget(subscription, webPushTargetId, frontendClient);
}

async function createWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
  frontendClient: NotifiFrontendClient,
  db: IndexedDb,
) {
  const targetGroups = await frontendClient.getTargetGroups();
  const defaultTargetGroup = targetGroups.find(
    (targetGroup) => targetGroup.name === 'Default',
  );
  if (!defaultTargetGroup?.webPushTargets)
    throw new Error('createWebPushTarget: default target group not found.');
  const authBuffer = subscription.getKey('auth');
  const p256dhBuffer = subscription.getKey('p256dh');
  if (!authBuffer || !p256dhBuffer)
    throw new Error(
      'createWebPushTarget: invalid subscription auth or p256dh key',
    );
  const webPushTargetIds = defaultTargetGroup.webPushTargets
    .map((it) => it?.id)
    .filter((it): it is string => !!it);

  const webPushTargetResponse = await frontendClient.createWebPushTarget({
    vapidPublicKey: vapidPublicKey,
    endpoint: subscription.endpoint,
    auth: uint8ArrayToBase64Url(new Uint8Array(authBuffer)),
    p256dh: uint8ArrayToBase64Url(new Uint8Array(p256dhBuffer)),
  });

  if (
    !webPushTargetResponse.createWebPushTarget.webPushTarget ||
    !webPushTargetResponse.createWebPushTarget.webPushTarget?.id
  ) {
    throw new Error('createWebPushTarget: failed to create web push target. ');
  }

  webPushTargetIds.push(
    webPushTargetResponse.createWebPushTarget.webPushTarget?.id,
  );
  // TODO: Rather than using ensureTargetGroup, might create a new client method for web push target
  await frontendClient.ensureTargetGroup({
    name: 'Default',
    emailAddress: defaultTargetGroup?.emailTargets?.[0]?.emailAddress,
    phoneNumber: defaultTargetGroup?.smsTargets?.[0]?.phoneNumber,
    telegramId: defaultTargetGroup?.telegramTargets?.[0]?.telegramId,
    discordId: defaultTargetGroup?.discordTargets?.[0]?.name,
    slackId: defaultTargetGroup?.slackChannelTargets?.[0]?.name,
    walletId: defaultTargetGroup?.web3Targets?.[0]?.name,
    webPushTargetIds: webPushTargetIds,
  });
  await db.set(
    webPushTargetIdKey,
    webPushTargetResponse.createWebPushTarget.webPushTarget?.id,
  );
}

async function updateWebPushTarget(
  subscription: PushSubscription,
  webPushTargetId: string,
  frontendClient: NotifiFrontendClient,
) {
  const authBuffer = subscription.getKey('auth');
  const p256dhBuffer = subscription.getKey('p256dh');
  if (!authBuffer || !p256dhBuffer)
    throw new Error(
      'updateWebPushTarget: invalid subscription auth or p256dh key',
    );

  await frontendClient.updateWebPushTarget({
    id: webPushTargetId,
    endpoint: subscription.endpoint,
    auth: uint8ArrayToBase64Url(new Uint8Array(authBuffer)),
    p256dh: uint8ArrayToBase64Url(new Uint8Array(p256dhBuffer)),
  });
}
