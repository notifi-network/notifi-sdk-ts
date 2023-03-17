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
  type SupportedEventDetailPropsMap = Map<
    string,
    (notification: NotificationHistoryEntry) => AlertNotificationViewProps
  >;
  const supportedEventDetails: SupportedEventDetailPropsMap = new Map();
  supportedEventDetails.set(
    'BroadcastMessageEventDetails',
    (notification: NotificationHistoryEntry) => {
      const detail = notification.detail as BroadcastMessageEventDetails;
      return {
        notificationTitle: 'Announcement',
        notificationImage: <AnnouncementIcon />,
        notificationSubject: detail.subject ?? '',
        notificationDate: notification.createdDate,
        notificationMessage: detail.message ?? '',
      };
    },
  );
  supportedEventDetails.set(
    'HealthValueOverThresholdEventDetails',
    (notification: NotificationHistoryEntry) => {
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
  );
  supportedEventDetails.set('GenericEventDetails', (notification) => {
    const detail = notification.detail as GenericEventDetails;
    return {
      notificationTitle: detail.sourceName,
      notificationImage: <AlertIcon icon={detail.icon} />,
      notificationSubject: detail.notificationTypeName,
      notificationDate: notification.createdDate,
      notificationMessage: detail.genericMessage,
    };
  });
  supportedEventDetails.set(
    'ChatMessageReceivedEventDetails',
    (notification) => {
      const detail = notification.detail as ChatMessageReceivedEventDetails;
      return {
        notificationTitle: `New Message from ${detail.senderName}`,
        notificationSubject: `New Message from ${detail.senderName}`,
        notificationDate: notification.createdDate,
        notificationMessage: detail.messageBody,
        notificationImage: <ChatAlertIcon width={17} height={17} />,
      };
    },
  );
  supportedEventDetails.set(
    'AccountBalanceChangedEventDetails',
    (notification) => {
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
  );

  const validateIsSupported = (entry?: NotificationHistoryEntry): boolean => {
    if (supportedEventDetails.get(entry?.detail?.__typename ?? '')) return true;
    return false;
  };

  const getAlertNotificationViewBaseProps = (
    notification: NotificationHistoryEntry,
  ): AlertNotificationViewProps => {
    const genProps = supportedEventDetails.get(
      notification.detail?.__typename ?? '',
    );
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

  return {
    getAlertNotificationViewBaseProps,
    validateIsSupported,
  };
};
