import {
  useDestinationState,
  useNotifiClientContext,
} from '@notifi-network/notifi-react-card';
import { useCallback, useMemo } from 'react';

export type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
};

export const useNotifiTargets = () => {
  const { frontendClient } = useNotifiClientContext();
  const { unverifiedDestinations } = useDestinationState();

  const renewTargetGroups = useCallback(
    async (targetGroup: TargetGroupData) => {
      return frontendClient.ensureTargetGroup(targetGroup);
    },
    [frontendClient],
  );

  const unVerifiedDestinationsString = useMemo(() => {
    const convertedUnVerifiedDestinations = unverifiedDestinations.map(
      (target) => {
        switch (target) {
          case 'telegram':
            return 'Telegram ID';
          case 'discord':
            return 'Discord';
          case 'phoneNumber':
            return 'Phone Number';
          default:
            return target;
        }
      },
    );
    return convertedUnVerifiedDestinations.length > 1
      ? convertedUnVerifiedDestinations.join(' and ')
      : convertedUnVerifiedDestinations[0];
  }, [unverifiedDestinations]);

  return {
    renewTargetGroups,
    unVerifiedDestinationsString,
  };
};
