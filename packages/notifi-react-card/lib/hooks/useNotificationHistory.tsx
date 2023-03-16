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
  class SupportedEntryDetail {
    typename: string;
    generateProps: (
      notification: NotificationHistoryEntry,
    ) => AlertNotificationViewProps;
    constructor(
      typename: string,
      generateProps: (
        notification: NotificationHistoryEntry,
      ) => AlertNotificationViewProps,
    ) {
      this.typename = typename;
      this.generateProps = generateProps;
    }
  }

  const supportedHistoryDetails: SupportedEntryDetail[] = [
    new SupportedEntryDetail('BroadcastMessageEventDetails', (notification) => {
      const detail = notification.detail as BroadcastMessageEventDetails;
      return {
        notificationTitle: 'Announcement',
        notificationImage: <AnnouncementIcon />,
        notificationSubject: detail.subject ?? '',
        notificationDate: notification.createdDate,
        notificationMessage: detail.message ?? '',
      };
    }),
    new SupportedEntryDetail(
      'HealthValueOverThresholdEventDetails',
      (notification) => {
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
    ),
    new SupportedEntryDetail('GenericEventDetails', (notification) => {
      const detail = notification.detail as GenericEventDetails;
      return {
        notificationTitle: detail.sourceName,
        notificationImage: <AlertIcon icon={detail.icon} />,
        notificationSubject: detail.notificationTypeName,
        notificationDate: notification.createdDate,
        notificationMessage: detail.genericMessage,
      };
    }),
    new SupportedEntryDetail(
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
    ),
    new SupportedEntryDetail(
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
    ),
  ];

  const validateIsSupported = (entry?: NotificationHistoryEntry): boolean => {
    if (
      supportedHistoryDetails
        .map((d) => d.typename)
        .includes(entry?.detail?.__typename ?? '')
    )
      return true;
    return false;
  };

  const getAlertNotificationViewBaseProps = (
    notification: NotificationHistoryEntry,
  ): AlertNotificationViewProps => {
    const genProps = supportedHistoryDetails.find(
      (d) => d.typename === notification.detail?.__typename,
    )?.generateProps;
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
