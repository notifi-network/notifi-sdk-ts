import type {
  CreateSourceInput,
  FilterOptions,
} from '@notifi-network/notifi-core';

import { resolveStringRef } from '../components/subscription/resolveRef';
import { EventTypeConfig } from '../hooks/SubscriptionCardConfig';

export type AlertConfiguration = Readonly<{
  sourceType: CreateSourceInput['type'];
  createSource?: Readonly<{
    address: string;
  }>;
  filterType: string;
  filterOptions: FilterOptions | null;
}>;

export const broadcastMessageConfiguration = ({
  topicName,
}: Readonly<{
  topicName: string;
}>): AlertConfiguration => {
  return {
    filterType: 'BROADCAST_MESSAGES',
    filterOptions: {},
    sourceType: 'BROADCAST',
    createSource: {
      address: topicName,
    },
  };
};

export const directMessageConfiguration = (
  params?: Readonly<{
    type?: string;
  }>,
): AlertConfiguration => {
  const type = params?.type;
  return {
    sourceType: 'DIRECT_PUSH',
    filterType: 'DIRECT_TENANT_MESSAGES',
    filterOptions: type === undefined ? null : { directMessageType: type },
  };
};

export const healthThresholdConfiguration = ({
  alertFrequency,
  percentage,
}: Readonly<{
  alertFrequency: FilterOptions['alertFrequency'];
  percentage: number;
}>): AlertConfiguration => {
  return {
    sourceType: 'DIRECT_PUSH',
    filterType: 'VALUE_THRESHOLD',
    filterOptions: {
      alertFrequency,
      threshold: percentage,
    },
  };
};

export const hedgeProtocolConfiguration = ({
  walletAddress,
}: Readonly<{
  walletAddress: string;
}>): AlertConfiguration => {
  return {
    filterType: 'LIQUIDATIONS',
    filterOptions: {},
    sourceType: 'HEDGE_PROTOCOL',
    createSource: {
      address: walletAddress,
    },
  };
};

export const createConfigurations = (
  eventTypes: EventTypeConfig,
): Record<string, AlertConfiguration> => {
  const configs: Record<string, AlertConfiguration> = {};
  eventTypes.forEach((eventType) => {
    switch (eventType.type) {
      case 'broadcast': {
        const broadcastId = resolveStringRef(
          eventType.name,
          eventType.broadcastId,
          {},
        );

        configs[eventType.name] = broadcastMessageConfiguration({
          topicName: broadcastId,
        });
        break;
      }
      case 'directPush': {
        const pushId = resolveStringRef(
          eventType.name,
          eventType.directPushId,
          {},
        );

        configs[eventType.name] = directMessageConfiguration({
          type: pushId,
        });

        break;
      }
    }
  });

  return configs;
};
