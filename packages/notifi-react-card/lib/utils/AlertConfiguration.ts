import {
  EventTypeConfig,
  FilterOptions,
} from '@notifi-network/notifi-frontend-client';
import type { Types } from '@notifi-network/notifi-graphql';

import { resolveStringRef } from '../components/subscription/resolveRef';
import { NotifiSubscriptionData } from '../context';
import { walletToSource } from './walletUtils';

export type SingleSourceAlertConfiguration = Readonly<{
  type: 'single';
  sourceType: Types.CreateSourceInput['type'];
  createSource?: Readonly<{
    address: string;
    fusionEventTypeId?: string;
  }>;
  filterType: string;
  filterOptions: FilterOptions | null;
  sourceGroupName?: string;
  maintainSourceGroup?: boolean;
}>;

export type MultipleSourceAlertConfiguration = Readonly<{
  type: 'multiple';
  sources: ReadonlyArray<Types.CreateSourceInput>;
  filterType: string;
  filterOptions: FilterOptions | null;
  sourceGroupName?: string;
  maintainSourceGroup?: boolean;
}>;

export type AlertConfiguration =
  | SingleSourceAlertConfiguration
  | MultipleSourceAlertConfiguration;

export const customThresholdConfiguration = ({
  alertFrequency,
  threshold,
  filterType,
  thresholdDirection,
  sourceType,
  sourceAddress,
}: Readonly<{
  alertFrequency: FilterOptions['alertFrequency'];
  threshold: number;
  filterType: string;
  thresholdDirection: FilterOptions['thresholdDirection'];
  sourceType: Types.CreateSourceInput['type'];
  sourceAddress: string;
}>): AlertConfiguration => {
  return {
    type: 'single',
    sourceType,
    filterType,
    filterOptions: {
      alertFrequency,
      threshold,
      thresholdDirection,
    },
    createSource: {
      address: sourceAddress,
    },
  };
};

export const customToggleConfiguration = ({
  filterType,
  filterOptions,
  sourceType,
  sourceAddress,
}: Readonly<{
  filterType: string;
  filterOptions: FilterOptions;
  sourceType: Types.CreateSourceInput['type'];
  sourceAddress: string;
}>): AlertConfiguration => {
  return {
    type: 'single',
    sourceType,
    filterType,
    filterOptions,
    createSource: {
      address: sourceAddress,
    },
  };
};

export type XMTPTopic = Readonly<{
  address: string | null;
  walletBlockchain: string;
}>;

const topicToSource = (topic: string): Types.CreateSourceInput => {
  return {
    name: topic,
    blockchainAddress: topic,
    type: 'XMTP',
  };
};

export const XMTPToggleConfiguration = ({
  XMTPTopics,
}: Readonly<{
  XMTPTopics: ReadonlyArray<string>;
}>): AlertConfiguration => {
  return {
    type: 'multiple',
    filterType: 'WEB3_CHAT_MESSAGES',
    filterOptions: {},
    sources: XMTPTopics.map(topicToSource),
  };
};

export const broadcastMessageConfiguration = ({
  topicName,
}: Readonly<{
  topicName: string;
}>): AlertConfiguration => {
  return {
    type: 'single',
    filterType: 'BROADCAST_MESSAGES',
    filterOptions: {},
    sourceType: 'BROADCAST',
    createSource: {
      address: topicName,
    },
  };
};

export const fusionToggleConfiguration = ({
  fusionId,
  fusionSourceAddress,
  maintainSourceGroup,
  alertFrequency,
}: Readonly<{
  fusionId: string;
  fusionSourceAddress: string;
  maintainSourceGroup?: boolean;
  alertFrequency: FilterOptions['alertFrequency'] | undefined;
}>): AlertConfiguration => {
  return {
    type: 'single',
    maintainSourceGroup,
    filterType: 'FUSION_SOURCE',
    filterOptions: alertFrequency === undefined ? {} : { alertFrequency },
    sourceType: 'FUSION_SOURCE',
    createSource: {
      address: fusionSourceAddress,
      fusionEventTypeId: fusionId,
    },
  };
};

type FusionToggleConfiguration = {
  fusionId: string;
  fusionSourceAddress: string;
  maintainSourceGroup?: boolean;
  alertFrequency: FilterOptions['alertFrequency'];
  threshold: number;
  thresholdDirection: FilterOptions['thresholdDirection'];
};
export const fusionHealthCheckConfiguration = (
  props: FusionToggleConfiguration,
): AlertConfiguration => {
  return {
    type: 'single',
    maintainSourceGroup: props.maintainSourceGroup,
    filterType: 'FUSION_SOURCE',
    filterOptions: {
      alertFrequency: props.alertFrequency,
      threshold: props.threshold,
      thresholdDirection: props.thresholdDirection,
    },
    sourceType: 'FUSION_SOURCE',
    createSource: {
      address: props.fusionSourceAddress,
      fusionEventTypeId: props.fusionId,
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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
    type: 'single',
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

export const walletBalanceConfiguration = ({
  connectedWallets,
}: Readonly<{
  connectedWallets: ReadonlyArray<Types.ConnectedWalletFragmentFragment>;
}>): AlertConfiguration => {
  return {
    type: 'multiple',
    filterType: 'BALANCE',
    filterOptions: null,
    sources: connectedWallets
      .filter(
        (wallet): wallet is Types.ConnectedWalletFragmentFragment => !!wallet,
      )
      .map(walletToSource),
    sourceGroupName: 'User Wallets',
  };
};

export const priceChangeConfiguration = ({
  tokenIds,
}: Readonly<{
  tokenIds: ReadonlyArray<string>;
}>): AlertConfiguration => {
  return {
    type: 'multiple',
    filterType: 'COIN_PRICE_CHANGE_EVENTS',
    filterOptions: null,
    sources: tokenIds.map((tokenId) => {
      return {
        name: tokenId,
        type: 'COIN_PRICE_CHANGES',
        blockchainAddress: tokenId,
      };
    }),
  };
};

export const createConfigurations = (
  eventTypes: EventTypeConfig,
  inputs: Record<string, unknown>,
  connectedWallets: NotifiSubscriptionData['connectedWallets'],
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
      case 'custom': {
        switch (eventType.selectedUIType) {
          case 'HEALTH_CHECK': {
            const thresholdDirection = eventType.checkRatios[0].type ?? 'below';
            const ratioNumber = eventType.checkRatios[1].ratio;
            configs[eventType.name] = customThresholdConfiguration({
              sourceType: eventType.sourceType,
              filterType: eventType.filterType,
              alertFrequency: eventType.alertFrequency,
              sourceAddress: resolveStringRef(
                eventType.name,
                eventType.sourceAddress,
                inputs,
              ),
              thresholdDirection: thresholdDirection,
              threshold:
                eventType.numberType === 'percentage'
                  ? ratioNumber / 100
                  : ratioNumber,
            });
            break;
          }
          case 'TOGGLE': {
            configs[eventType.name] = customToggleConfiguration({
              sourceType: eventType.sourceType,
              filterType: eventType.filterType,
              filterOptions: eventType.filterOptions,
              sourceAddress: resolveStringRef(
                eventType.name,
                eventType.sourceAddress,
                inputs,
              ),
            });
            break;
          }
        }
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
      case 'walletBalance': {
        configs[eventType.name] = walletBalanceConfiguration({
          connectedWallets: connectedWallets.filter(
            (wallet): wallet is Types.ConnectedWalletFragmentFragment =>
              !!wallet,
          ),
        });
        break;
      }
      case 'priceChange': {
        configs[eventType.name] = priceChangeConfiguration({
          tokenIds: eventType.tokenIds,
        });
        break;
      }
      case 'fusionToggle': // fusionToggle is deprecated (use 'fusion' type with 'selectedUIType = TOGGLE' instead )
        configs[eventType.name] = fusionToggleConfiguration({
          maintainSourceGroup: eventType.maintainSourceGroup,
          fusionId: resolveStringRef(
            eventType.name,
            eventType.fusionEventId,
            inputs,
          ),
          fusionSourceAddress: resolveStringRef(
            eventType.name,
            eventType.sourceAddress,
            inputs,
          ),
          alertFrequency: eventType.alertFrequency,
        });
        break;
      case 'fusion': {
        switch (eventType.selectedUIType) {
          case 'TOGGLE':
            configs[eventType.name] = fusionToggleConfiguration({
              maintainSourceGroup: eventType.maintainSourceGroup,
              fusionId: resolveStringRef(
                eventType.name,
                eventType.fusionEventId,
                inputs,
              ),
              fusionSourceAddress: resolveStringRef(
                eventType.name,
                eventType.sourceAddress,
                inputs,
              ),
              alertFrequency: eventType.alertFrequency,
            });
            break;
          case 'HEALTH_CHECK':
            configs[eventType.name] = fusionHealthCheckConfiguration({
              maintainSourceGroup: eventType.maintainSourceGroup,
              fusionId: resolveStringRef(
                eventType.name,
                eventType.fusionEventId,
                inputs,
              ),
              fusionSourceAddress: resolveStringRef(
                eventType.name,
                eventType.sourceAddress,
                inputs,
              ),
              alertFrequency: eventType.alertFrequency,
              thresholdDirection: eventType.checkRatios[0].type ?? 'below',
              threshold:
                eventType.numberType === 'percentage'
                  ? eventType.checkRatios[1].ratio / 100
                  : eventType.checkRatios[1].ratio,
            });
        }
      }
    }
  });

  return configs;
};
