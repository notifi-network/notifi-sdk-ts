import type {
  CreateSourceInput,
  FilterOptions,
} from '@notifi-network/notifi-core';

import { resolveStringRef } from '../components/subscription/resolveRef';
import { EventTypeConfig } from './../hooks/SubscriptionCardConfig';

export type AlertConfiguration = Readonly<{
  sourceType: CreateSourceInput['type'];
  createSource?: Readonly<{
    address: string;
  }>;
  filterType: string;
  filterOptions: FilterOptions | null;
}>;

export const chatConfiguration = (): AlertConfiguration => {
  return {
    filterType: 'NOTIFI_CHAT_MESSAGES',
    filterOptions: {
      alertFrequency: 'THREE_MINUTES',
    },
    sourceType: 'NOTIFI_CHAT',
    createSource: {
      address: '*',
    },
  };
};

export const customThresholdConfiguration = ({
  alertFrequency,
  percentage,
  filterType,
  thresholdDirection,
  sourceType,
  sourceAddress,
}: Readonly<{
  alertFrequency: FilterOptions['alertFrequency'];
  percentage: number;
  filterType: string;
  thresholdDirection: FilterOptions['thresholdDirection'];
  sourceType: CreateSourceInput['type'];
  sourceAddress: string;
}>): AlertConfiguration => {
  return {
    sourceType,
    filterType,
    filterOptions: {
      alertFrequency,
      threshold: percentage,
      thresholdDirection,
    },
    createSource: {
      address: sourceAddress,
    },
  };
};

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
  thresholdDirection,
}: Readonly<{
  alertFrequency: FilterOptions['alertFrequency'];
  percentage: number;
  thresholdDirection: FilterOptions['thresholdDirection'];
}>): AlertConfiguration => {
  return {
    sourceType: 'DIRECT_PUSH',
    filterType: 'VALUE_THRESHOLD',
    filterOptions: {
      alertFrequency,
      threshold: percentage,
      thresholdDirection,
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

export const tradingPairConfiguration = ({
  tradingPair,
  above,
  price,
}: Readonly<{
  tradingPair: string;
  above: boolean;
  price: number;
}>): AlertConfiguration => {
  return {
    sourceType: 'DIRECT_PUSH',
    filterType: 'DIRECT_TENANT_MESSAGES',
    filterOptions: {
      tradingPair,
      values: {
        and: [
          {
            key: 'spotPrice',
            op: above ? 'gt' : 'lt',
            value: price.toFixed(8),
          },
        ],
      },
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
