import { useMemo } from 'react';

import { FormField, useNotifiSubscriptionContext } from '../context';
import { objectKeys } from '../utils';

export const useDestinationState = () => {
  const {
    useDiscord,
    useSlack,
    email,
    phoneNumber,
    telegramId,
    discordTargetData,
    slackTargetData,
    destinationErrorMessages,
  } = useNotifiSubscriptionContext();

  const isTargetsExist = useMemo(() => {
    return (
      !!email ||
      !!phoneNumber ||
      !!telegramId ||
      (useDiscord && !!discordTargetData?.id) ||
      (useSlack && !!slackTargetData?.id)
    );
  }, [
    email,
    phoneNumber,
    telegramId,
    discordTargetData,
    useDiscord,
    useSlack,
    slackTargetData,
  ]);

  const unverifiedDestinations = useMemo(() => {
    const {
      email: emailError,
      phoneNumber: phoneNumberError,
      telegram: telegramError,
      discord: discordError,
      slack: slackError,
    } = destinationErrorMessages;

    const unConfirmedTargets = {
      email: emailError?.type === 'recoverableError',
      phoneNumber: phoneNumberError?.type == 'recoverableError',
      telegram: telegramError?.type === 'recoverableError',
      slack:
        useSlack &&
        slackError?.type === 'recoverableError' &&
        slackError.message === 'Enable Bot',
      discord:
        useDiscord &&
        discordError?.type === 'recoverableError' &&
        /**
         * @TODO Improve type safety
         * discordError.message === 'Join Server' also counted as verified (discordError.message now either 'Join Server' or 'Enable Bot' as values).
         */
        discordError.message === 'Enable Bot',
    };
    return objectKeys(unConfirmedTargets)
      .map((key) => {
        if (unConfirmedTargets[key]) {
          return key;
        }
      })
      .filter((item): item is FormField => !!item);
  }, [destinationErrorMessages]);

  return { isTargetsExist, unverifiedDestinations };
};
