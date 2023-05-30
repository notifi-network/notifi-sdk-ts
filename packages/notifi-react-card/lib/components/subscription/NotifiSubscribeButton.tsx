import { SignMessageParams } from '@notifi-network/notifi-core';
import {
  CardConfigItemV1,
  EventTypeConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { formatTelegramForSubscription } from 'notifi-react-card/lib/utils/stringUtils';
import React, { useCallback, useMemo } from 'react';

import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../context';
import { useNotifiSubscribe } from '../../hooks';
import {
  createConfigurations,
  subscribeAlertsByFrontendClient,
} from '../../utils';

export type NotifiSubscribeButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  buttonText: string;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
}>;

export const NotifiSubscribeButton: React.FC<NotifiSubscribeButtonProps> = ({
  buttonText,
  classNames,
  data,
  inputs,
}) => {
  const eventTypes = data.eventTypes;
  const { isInitialized, subscribe, updateTargetGroups } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const {
    client,
    params: { multiWallet },
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

  const {
    cardView,
    connectedWallets,
    loading,
    setCardView,
    useDiscord,
    params,
    render,
    setLoading,
  } = useNotifiSubscriptionContext();

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const { email: emailErrorMessage, phoneNumber: smsErrorMessage } =
    formErrorMessages;

  const isMultiWallet = (multiWallet?.ownedWallets?.length ?? 0) > 0;

  const targetGroup = useMemo(
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

  const subscribeAlerts = useCallback(
    async (eventTypes: EventTypeConfig, inputs: Record<string, unknown>) => {
      if (isCanaryActive) {
        await renewTargetGroups();
        return subscribeAlertsByFrontendClient(
          frontendClient,
          eventTypes,
          inputs,
        );
      }
      return subscribe(
        createConfigurations(eventTypes, inputs, connectedWallets),
      );
    },
    [
      isCanaryActive,
      frontendClient,
      email,
      phoneNumber,
      telegramId,
      useDiscord,
    ],
  );

  const renewTargetGroups = useCallback(async () => {
    if (isCanaryActive) {
      return frontendClient.ensureTargetGroup(targetGroup);
    }
    return updateTargetGroups();
  }, [email, phoneNumber, useDiscord, telegramId, frontendClient]);

  const onClick = useCallback(async () => {
    let isFirstTimeUser = (client.data?.targetGroups?.length ?? 0) === 0;
    if (
      isCanaryActive &&
      frontendClient.userState?.status !== 'authenticated'
    ) {
      await frontendClient.logIn({
        walletBlockchain: params.walletBlockchain,
        signMessage: params.signMessage,
      } as SignMessageParams);
      const data = await frontendClient.fetchData();
      isFirstTimeUser = (data.targetGroup?.length ?? 0) === 0;
    }

    setLoading(true);
    try {
      let success = false;
      if (isFirstTimeUser && !isMultiWallet) {
        const result = await subscribeAlerts(eventTypes, inputs);
        success = !!result;
      } else {
        const result = await renewTargetGroups();
        success = !!result;
      }

      if (isCanaryActive && success) {
        const newData = await frontendClient.fetchData();
        render(newData);
      }

      if (success === true) {
        const nextState = !isMultiWallet
          ? 'preview'
          : cardView.state === 'signup'
          ? 'verifyonboarding'
          : 'verify';
        setCardView({
          state: nextState,
        });
      }
    } catch (e) {
      setCardView({ state: 'error', reason: e });
    }
    setLoading(false);
  }, [
    isMultiWallet,
    client,
    eventTypes,
    subscribe,
    updateTargetGroups,
    setCardView,
  ]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';

  return (
    <button
      className={clsx('NotifiSubscribeButton__button', classNames?.button)}
      disabled={
        !isInitialized ||
        loading ||
        hasErrors ||
        (!email && !phoneNumber && !telegramId && useDiscord === false)
      }
      onClick={onClick}
    >
      <span className={clsx('NotifiSubscribeButton__label', classNames?.label)}>
        {loading ? 'Loading' : buttonText}
      </span>
    </button>
  );
};
