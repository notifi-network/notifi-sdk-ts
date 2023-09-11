import { Types } from '@notifi-network/notifi-graphql';
import React from 'react';

import { AnnouncementIcon } from '../assets/AnnouncementIcon';
import { ChatAlertIcon } from '../assets/ChatAlertIcon';
import { RatioCheckIcon } from '../assets/RatioCheckIcon';
import { SwapIcon } from '../assets/SwapIcon';
import { AlertIcon } from '../components/AlertHistory/AlertIcon';
import { AlertNotificationViewProps } from '../components/AlertHistory/AlertNotificationRow';
import { NotificationHistoryEntry } from '../components/subscription';
import { formatAmount } from './AlertHistoryUtils';

type AccountBalanceChangedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'AccountBalanceChangedEventDetails' }
>;

type BroadcastMessageEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'BroadcastMessageEventDetails' }
>;

type ChatMessageReceivedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'ChatMessageReceivedEventDetails' }
>;

type HealthValueOverThresholdEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'HealthValueOverThresholdEventDetails' }
>;

type GenericEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;

type AlertDetailsContents = {
  topContent: string;
  bottomContent: string;
  otherContent?: string;
};

type SupportedEventDetailPropsMap = Map<
  string,
  {
    getViewProps: (
      notification: NotificationHistoryEntry,
    ) => AlertNotificationViewProps;
    getAlertDetailsContents: (
      notification: NotificationHistoryEntry,
    ) => AlertDetailsContents;
  }
>;

const supportedEventDetails: SupportedEventDetailPropsMap = new Map();

supportedEventDetails.set('BroadcastMessageEventDetails', {
  getViewProps: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as BroadcastMessageEventDetails;
    return {
      notificationTitle: 'Announcement',
      notificationImage: <AnnouncementIcon />,
      notificationSubject: detail.subject ?? '',
      notificationDate: notification.createdDate,
      notificationMessage: detail.message ?? '',
    };
  },
  getAlertDetailsContents: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as BroadcastMessageEventDetails;
    return {
      topContent: detail.subject ?? '',
      bottomContent: detail.message ?? '',
    };
  },
});

supportedEventDetails.set('HealthValueOverThresholdEventDetails', {
  getViewProps: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as HealthValueOverThresholdEventDetails;
    const threshold = detail.threshold ?? '';
    const name = detail.name ?? '';
    const value = detail.value ?? '';
    let thresholdDirection = '';
    if (parseFloat(value) > parseFloat(threshold)) {
      thresholdDirection = 'under';
    } else {
      thresholdDirection = 'over';
    }
    return {
      notificationTitle: 'Health Check',
      notificationImage: <RatioCheckIcon />,
      notificationSubject: `${name} ${thresholdDirection} ${threshold}`,
      notificationDate: notification.createdDate,
      notificationMessage: undefined,
    };
  },
  getAlertDetailsContents: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as HealthValueOverThresholdEventDetails;
    return {
      topContent: detail.name,
      bottomContent: `value: ${detail.value}`,
      otherContent: `threshold: ${detail.threshold}`,
    };
  },
});

supportedEventDetails.set('GenericEventDetails', {
  getViewProps: (notification) => {
    const detail = notification.detail as GenericEventDetails;
    return {
      notificationTitle: detail.sourceName,
      notificationImage: <AlertIcon icon={detail.icon} />,
      notificationSubject: detail.notificationTypeName,
      notificationDate: notification.createdDate,
      notificationMessage: detail.genericMessage,
    };
  },
  getAlertDetailsContents: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as GenericEventDetails;
    return {
      topContent: detail.notificationTypeName,
      bottomContent: detail.genericMessage,
    };
  },
});

supportedEventDetails.set('ChatMessageReceivedEventDetails', {
  getViewProps: (notification) => {
    const detail = notification.detail as ChatMessageReceivedEventDetails;
    return {
      notificationTitle: `New Message from ${detail.senderName}`,
      notificationSubject: `New Message from ${detail.senderName}`,
      notificationDate: notification.createdDate,
      notificationMessage: detail.messageBody,
      notificationImage: <ChatAlertIcon width={17} height={17} />,
    };
  },
  getAlertDetailsContents: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as ChatMessageReceivedEventDetails;
    return {
      topContent: `New Message from ${detail.senderName}`,
      bottomContent: detail.messageBody,
    };
  },
});

supportedEventDetails.set('AccountBalanceChangedEventDetails', {
  getViewProps: (notification) => {
    const detail = notification.detail as AccountBalanceChangedEventDetails;
    const changeAmount = formatAmount(
      Math.abs(detail.previousValue - detail.newValue),
    );

    const getTitle = () => {
      return detail.direction === 'INCOMING'
        ? `Incoming Transaction: ${changeAmount} ${detail.tokenSymbol}`
        : `Outgoing Transaction: -${changeAmount} ${detail.tokenSymbol}`;
    };

    const walletBlockchain = detail.walletBlockchain;
    const direction = detail.direction === 'INCOMING' ? '' : '-';
    const message = `${walletBlockchain} Wallet account balance changed by ${direction}${changeAmount} ${detail.tokenSymbol}`;
    return {
      notificationImage: <SwapIcon />,
      notificationTitle: 'Wallet Balance Change',
      notificationSubject: getTitle(),
      notificationDate: notification.createdDate,
      notificationMessage: message,
    };
  },
  getAlertDetailsContents: (notification: NotificationHistoryEntry) => {
    const detail = notification.detail as AccountBalanceChangedEventDetails;
    const changeAmount = `${formatAmount(
      Math.abs(detail.previousValue - detail.newValue),
    )}`;

    const topContent =
      detail.direction === 'INCOMING'
        ? `Incoming Transaction: ${changeAmount}  ${detail.tokenSymbol}`
        : `Outgoing Transaction: -${changeAmount}  ${detail.tokenSymbol}`;

    const direction = detail.direction === 'INCOMING' ? '' : '-';
    const bottomContent = ` ${detail.walletBlockchain} wallet account balance changed by ${direction}${changeAmount} ${detail.tokenSymbol}`;
    return {
      topContent,
      bottomContent: bottomContent,
    };
  },
});

const validateIsSupported = (entry?: NotificationHistoryEntry): boolean => {
  if (supportedEventDetails.get(entry?.detail?.__typename ?? '')) return true;
  return false;
};

const getAlertNotificationViewBaseProps = (
  notification: NotificationHistoryEntry,
): AlertNotificationViewProps => {
  const genProps = supportedEventDetails.get(
    notification.detail?.__typename ?? '',
  )?.getViewProps;
  return !!notification.detail && !!genProps
    ? genProps(notification)
    : // It should never come here: exception should be filtered out before. https://virtuoso.dev/troubleshooting
      {
        notificationTitle: 'Unsupported notification',
        notificationImage: <AlertIcon icon={'INFO'} />,
        notificationSubject: 'Alert not supported yet',
        notificationDate: notification.createdDate,
        notificationMessage: 'Unsupported notification',
      };
};

const getAlertDetailsContents = (
  notification: NotificationHistoryEntry,
): AlertDetailsContents => {
  const getContents = supportedEventDetails.get(
    notification.detail?.__typename ?? '',
  )?.getAlertDetailsContents;
  return !!notification && !!getContents
    ? getContents(notification)
    : // It should never come here: exception should be filtered out before. https://virtuoso.dev/troubleshooting
      {
        topContent: 'Unsupported notification',
        bottomContent: 'Alert not supported yet',
      };
};

const concatHistoryNodes = (
  nodes: NotificationHistoryEntry[],
  nodesToConcat: NotificationHistoryEntry[],
) => {
  switch (nodes[0]?.__typename) {
    case 'FusionNotificationHistoryEntry':
      if (nodesToConcat[0]?.__typename !== 'FusionNotificationHistoryEntry') {
        return nodes;
      }
      return [...nodes, ...nodesToConcat];
    case 'NotificationHistoryEntry':
      if (nodesToConcat[0]?.__typename !== 'NotificationHistoryEntry') {
        return nodes;
      }
      return [...nodes, ...nodesToConcat];
    default:
      throw new Error('Invalid type: NotificationHistoryEntry');
  }
};

export {
  getAlertDetailsContents,
  getAlertNotificationViewBaseProps,
  validateIsSupported,
  concatHistoryNodes,
};
