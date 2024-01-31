import {
  EventTypeConfig,
  EventTypeItem,
  NotifiFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';

import { SubscriptionData } from '../hooks';

export const subscribeAlertByFrontendClient = async (
  frontendClient: NotifiFrontendClient,
  alertDetail: Readonly<{
    eventType: EventTypeItem;
    inputs: Record<string, unknown>;
  }>,
): Promise<SubscriptionData> => {
  await frontendClient.ensureAlert(alertDetail);
  const updatedData = await frontendClient.fetchData();
  const updatedTgs = updatedData.targetGroup;
  if (!(updatedTgs && updatedTgs.length > 0)) {
    throw new Error('No target groups found');
  }
  const updatedTg = {
    // adopt the first target group
    ...updatedTgs[0],
    name: updatedTgs[0]?.name ?? '',
  };

  const alerts: Record<string, Types.AlertFragmentFragment> = {};

  updatedData.alert?.forEach((alert) => {
    if (alert && alert.name) {
      alerts[alert.name] = alert;
    }
  });

  return {
    alerts,
    email: updatedTg.emailTargets?.[0]?.emailAddress ?? '',
    phoneNumber: updatedTg.smsTargets?.[0]?.phoneNumber ?? '',
    isPhoneNumberConfirmed: updatedTg.smsTargets?.[0]?.isConfirmed ?? false,
    telegramId: updatedTg.telegramTargets?.[0]?.telegramId ?? '',
    telegramConfirmationUrl:
      updatedTg.telegramTargets?.[0]?.confirmationUrl ?? '',
    discordId: updatedTg.discordTargets?.[0]?.id ?? '',
    slackId: updatedTg.slackChannelTargets?.[0]?.id ?? '',
  };
};

export const unsubscribeAlertByFrontendClient = async (
  frontendClient: NotifiFrontendClient,
  alertDetail: Readonly<{
    eventType: EventTypeItem;
    inputs: Record<string, unknown>;
  }>,
): Promise<void> => {
  const alerts = await frontendClient.getAlerts();
  const existing = alerts.find(
    (alert) => alert.name === alertDetail.eventType.name,
  );
  if (!existing || !existing?.id) throw new Error('Alert not found');
  await frontendClient.deleteAlert({ id: existing.id });
};

export const subscribeAlertsByFrontendClient = async (
  frontendClient: NotifiFrontendClient,
  eventTypes: EventTypeConfig,
  inputs: Record<string, unknown>,
): Promise<SubscriptionData> => {
  for (const eventType of eventTypes) {
    try {
      await frontendClient.ensureAlert({ eventType, inputs });
    } catch (e) {
      console.log(
        `EventType ${eventType.type} does not support default subscribe: ${e}`,
      );
    }
  }

  const updatedData = await frontendClient.fetchData();
  const updatedTgs = updatedData.targetGroup;
  if (!(updatedTgs && updatedTgs.length > 0)) {
    throw new Error('No target groups found');
  }
  const updatedTg = {
    // adopt the first target group
    ...updatedTgs[0],
    name: updatedTgs[0]?.name ?? '',
  };

  const alerts: Record<string, Types.AlertFragmentFragment> = {};

  updatedData.alert?.forEach((alert) => {
    if (alert && alert.name) {
      alerts[alert.name] = alert;
    }
  });

  return {
    alerts,
    email: updatedTg.emailTargets?.[0]?.emailAddress ?? '',
    phoneNumber: updatedTg.smsTargets?.[0]?.phoneNumber ?? '',
    isPhoneNumberConfirmed: updatedTg.smsTargets?.[0]?.isConfirmed ?? false,
    telegramId: updatedTg.telegramTargets?.[0]?.telegramId ?? '',
    telegramConfirmationUrl:
      updatedTg.telegramTargets?.[0]?.confirmationUrl ?? '',
    discordId: updatedTg.discordTargets?.[0]?.id ?? '',
    slackId: updatedTg.slackChannelTargets?.[0]?.id ?? '',
  };
};
