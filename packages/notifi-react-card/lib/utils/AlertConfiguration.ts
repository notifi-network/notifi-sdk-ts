import type {
  CreateSourceInput,
  FilterOptions,
} from '@notifi-network/notifi-core';

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
