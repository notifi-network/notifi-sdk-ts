import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { formatTelegramForSubscription } from '@/utils/stringUtils';
import {
  useDestinationState,
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useMemo, useState } from 'react';

export type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
};

type Target = 'email' | 'phoneNumber' | 'telegram' | 'discord' | 'slack';

export const useNotifiTargets = (target?: Target) => {
  const { formState } = useNotifiForm();
  const { frontendClient } = useNotifiClientContext();
  const { unverifiedDestinations } = useDestinationState();

  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();

  const { phoneNumber, telegram: telegramId, email } = formState;
  const { useDiscord, render, setUseDiscord } = useNotifiSubscriptionContext();

  const [hasEmailChanges, setHasEmailChanges] = useState<boolean>(false);
  const [hasTelegramChanges, setHasTelegramChanges] = useState<boolean>(false);

  const targetGroup: TargetGroupData = useMemo(
    () => ({
      name: 'Default',
      emailAddress: email === '' ? undefined : email,
      phoneNumber: isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined,
      telegramId:
        telegramId === ''
          ? undefined
          : formatTelegramForSubscription(telegramId),
      discordId: useDiscord ? 'Default' : undefined,
    }),
    [email, phoneNumber, telegramId, useDiscord],
  );

  const renewTargetGroups = useCallback(
    async (targetGroup: TargetGroupData) => {
      return frontendClient.ensureTargetGroup(targetGroup);
    },
    [frontendClient],
  );

  const afterEditDestination = () => {
    switch (target) {
      case 'email':
        setHasEmailChanges(false);
        break;
      case 'telegram':
        setHasTelegramChanges(false);
        break;
      default:
        break;
    }
  };

  const updateTarget = useCallback(async () => {
    setIsGlobalLoading(true);
    try {
      let success = false;
      if (target === 'discord') {
        setUseDiscord(!useDiscord);
        targetGroup.discordId = !useDiscord ? 'Default' : undefined;
      }

      if (target === 'slack') {
        setUseSlack(!useSlack);
        targetGroup.slackId = !useSlack ? 'Default' : undefined;
      }

      const result = await renewTargetGroups(targetGroup);
      success = !!result;

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
        afterEditDestination();
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to save, check console for more details');
      console.error('Failed to singup', (e as Error).message);
    }
    setIsGlobalLoading(false);
  }, [frontendClient, setGlobalError, targetGroup, useDiscord, useSlack]);

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
    updateTarget,
    renewTargetGroups,
    unVerifiedDestinationsString,
    hasEmailChanges,
    setHasEmailChanges,
    hasTelegramChanges,
    setHasTelegramChanges,
  };
};
