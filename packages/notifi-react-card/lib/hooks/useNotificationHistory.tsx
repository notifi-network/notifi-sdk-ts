import {
  AccountBalanceChangedEventDetails,
  BroadcastMessageEventDetails,
  ChatMessageReceivedEventDetails,
  GenericEventDetails,
  HealthValueOverThresholdEventDetails,
  NotificationHistoryEntry,
} from '@notifi-network/notifi-core';
import React from 'react';

import { AnnouncementIcon } from '../assets/AnnouncementIcon';
import { ChatAlertIcon } from '../assets/ChatAlertIcon';
import { RatioCheckIcon } from '../assets/RatioCheckIcon';
import { SwapIcon } from '../assets/SwapIcon';
import { AlertIcon } from '../components/AlertHistory/AlertIcon';
import { AlertNotificationViewProps } from '../components/AlertHistory/AlertNotificationRow';
import { formatAmount } from '../utils/AlertHistoryUtils';

export const useNotificationHistory = () => {
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
      const detail =
        notification.detail as HealthValueOverThresholdEventDetails;
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
      const detail =
        notification.detail as HealthValueOverThresholdEventDetails;
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
          : `Outgoing Transaction: ${changeAmount} ${detail.tokenSymbol}`;
      };
      const walletAddress = notification.sourceAddress ?? '';
      return {
        notificationImage: <SwapIcon />,
        notificationTitle: getTitle(),
        notificationSubject: getTitle(),
        notificationDate: notification.createdDate,
        notificationMessage: `Wallet ${walletAddress} account balance changed by ${changeAmount} ${detail.tokenSymbol}`,
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
          : `Outgoing Transaction: ${changeAmount}  ${detail.tokenSymbol}`;
      return {
        topContent,
        bottomContent: `Wallet ${notification.sourceAddress} account balance changed by ${changeAmount} ${detail.tokenSymbol}`,
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
      : // It should never come here because exception should be filtered out before. https://virtuoso.dev/troubleshooting/
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
      : // It should never come here because exception should be filtered out before. https://virtuoso.dev/troubleshooting/
        {
          topContent: 'Unsupported notification',
          bottomContent: 'Alert not supported yet',
        };
  };

  return {
    getAlertDetailsContents,
    getAlertNotificationViewBaseProps,
    validateIsSupported,
  };
};
