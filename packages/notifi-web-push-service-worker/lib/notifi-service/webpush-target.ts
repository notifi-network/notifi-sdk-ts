import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';

import { uint8ArrayToBase64Url } from '../utils';
import { webPushTargetIdKey } from '../utils/constants';
import { IndexedDb } from '../utils/db';

export async function createOrUpdateWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
  db: IndexedDb,
  frontendClient: NotifiFrontendClient,
) {
  const webPushTargetId = await db.get(webPushTargetIdKey);
  if (!webPushTargetId || webPushTargetId === '') {
    await createWebPushTarget(subscription, vapidPublicKey, frontendClient, db);
  } else {
    const getWebPushTargetsResponse = await frontendClient.getWebPushTargets({
      ids: [webPushTargetId],
    });

    if (getWebPushTargetsResponse?.nodes?.length !== 1) {
      await createWebPushTarget(
        subscription,
        vapidPublicKey,
        frontendClient,
        db,
      );
    } else {
      await updateWebPushTarget(subscription, webPushTargetId, frontendClient);
    }
  }
}

async function createWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
  frontendClient: NotifiFrontendClient,
  db: IndexedDb,
) {
  try {
    const targetGroups = await frontendClient.getTargetGroups();
    const defaultTargetGroup = targetGroups.find(
      (targetGroup) => targetGroup.name === 'Default',
    );
    if (!defaultTargetGroup?.webPushTargets)
      throw new Error('Default target group not found.');
    const authBuffer = subscription.getKey('auth');
    const p256dhBuffer = subscription.getKey('p256dh');
    if (!authBuffer || !p256dhBuffer)
      throw new Error('Invalid subscription auth or p256dh key');
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
      console.error(
        'Failed to create web push target. CreateWebPushTargetMutation failed.',
      );
      return;
    }

    webPushTargetIds.push(
      webPushTargetResponse.createWebPushTarget.webPushTarget?.id,
    );

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
  } catch (err) {
    console.error(err, 'Failed to create web push target.');
  }
}

async function updateWebPushTarget(
  subscription: PushSubscription,
  webPushTargetId: string,
  frontendClient: NotifiFrontendClient,
) {
  try {
    const authBuffer = subscription.getKey('auth');
    const p256dhBuffer = subscription.getKey('p256dh');
    if (!authBuffer || !p256dhBuffer)
      throw new Error('Invalid subscription auth or p256dh key');

    await frontendClient.updateWebPushTarget({
      id: webPushTargetId,
      endpoint: subscription.endpoint,
      auth: uint8ArrayToBase64Url(new Uint8Array(authBuffer)),
      p256dh: uint8ArrayToBase64Url(new Uint8Array(p256dhBuffer)),
    });
  } catch (err) {
    console.error(err, 'Failed to update web push target.');
  }
}
