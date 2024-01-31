'use client';

import { formatTelegramForSubscription } from '@/utils/stringUtils';
import { Types } from '@notifi-network/notifi-graphql';
import {
  useDestinationState,
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useGlobalStateContext } from './GlobalStateContext';

export type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
};

type Target = 'email' | 'phoneNumber' | 'telegram' | 'discord' | 'slack';

export type NotifiTargetContextType = {
  isLoading: boolean;
  targetGroup: TargetGroupData;
  updateTarget: (target: Target) => Promise<void>;
  renewTargetGroups: (
    targetGroup: TargetGroupData,
  ) => Promise<Types.TargetGroupFragmentFragment>;
  unVerifiedDestinationsString: string;
  hasEmailChanges: boolean;
  setHasEmailChanges: Dispatch<SetStateAction<boolean>>;
  hasTelegramChanges: boolean;
  setHasTelegramChanges: Dispatch<SetStateAction<boolean>>;
};

const NotifiTargetContext = createContext<NotifiTargetContextType>(
  {} as NotifiTargetContextType, // intentionally empty as initial value
);

export const NotifiTargetContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { formState } = useNotifiForm();
  const { frontendClient } = useNotifiClientContext();
  const { unverifiedDestinations } = useDestinationState();

  const { setGlobalError } = useGlobalStateContext();
  const [isLoading, setIsLoading] = useState(false);

  const { phoneNumber, telegram: telegramId, email } = formState;
  const {
    useDiscord,
    render,
    setUseDiscord,
    useSlack,
    setUseSlack,
    slackTargetData,
  } = useNotifiSubscriptionContext();

  const [hasEmailChanges, setHasEmailChanges] = useState<boolean>(false);
  const [hasTelegramChanges, setHasTelegramChanges] = useState<boolean>(false);
  const targetGroup: TargetGroupData = {
    name: 'Default',
    emailAddress: email === '' ? undefined : email,
    phoneNumber: isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined,
    telegramId:
      telegramId === '' ? undefined : formatTelegramForSubscription(telegramId),
    discordId: useDiscord ? 'Default' : undefined,
    slackId: slackTargetData ? slackTargetData.id : undefined,
  };

  const renewTargetGroups = useCallback(
    (targetGroup: TargetGroupData) => {
      setIsLoading(true);
      return frontendClient
        .ensureTargetGroup(targetGroup)
        .finally(() => setIsLoading(false));
    },
    [frontendClient],
  );

  const afterEditDestination = (target: Target) => {
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

  const updateTarget = useCallback(
    async (target: Target) => {
      setIsLoading(true);
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
          afterEditDestination(target);
        }
      } catch (e: unknown) {
        setGlobalError('ERROR: Failed to save, plase try again.');
        console.error('Failed to singup', (e as Error).message);
      }
      setIsLoading(false);
    },
    [frontendClient, setGlobalError, targetGroup, useDiscord, useSlack],
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
  return (
    <NotifiTargetContext.Provider
      value={{
        isLoading,
        targetGroup,
        updateTarget,
        renewTargetGroups,
        unVerifiedDestinationsString,
        hasEmailChanges,
        setHasEmailChanges,
        hasTelegramChanges,
        setHasTelegramChanges,
      }}
    >
      {children}
    </NotifiTargetContext.Provider>
  );
};

export const useNotifiTargetContext = () => useContext(NotifiTargetContext);
