import type { FilterOptions } from '@notifi-network/notifi-core';

export type AlertConfiguration = Readonly<{
  sourceType: string;
  filterType: string;
  filterOptions: FilterOptions | null;
}>;

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
