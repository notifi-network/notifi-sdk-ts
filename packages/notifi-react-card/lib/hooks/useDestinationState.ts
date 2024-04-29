import { useMemo } from 'react';

import { FormField, useNotifiSubscriptionContext } from '../context';
import { objectKeys } from '../utils';

export const useDestinationState = () => {
  const {
    useDiscord,
    useSlack,
    useWeb3,
    email,
    phoneNumber,
    telegramId,
    discordTargetData,
    slackTargetData,
    web3TargetData,
    destinationErrorMessages,
  } = useNotifiSubscriptionContext();

  const isTargetsExist = useMemo(() => {
    return (
      !!email ||
      !!phoneNumber ||
      !!telegramId ||
      (useDiscord && !!discordTargetData?.id) ||
      (useSlack && !!slackTargetData?.id) ||
      (useWeb3 && !!web3TargetData?.id)
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
      web3: web3Error,
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
      web3:
        useWeb3 &&
        web3Error?.type === 'recoverableError' &&
        web3Error.message === 'Enable Bot',
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
