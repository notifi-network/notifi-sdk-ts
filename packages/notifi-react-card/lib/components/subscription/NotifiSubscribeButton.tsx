import {
  CardConfigItemV1,
  EventTypeConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useMemo } from 'react';

import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../context';
import { useNotifiSubscribe } from '../../hooks';
import { useFrontendClientLogin } from '../../hooks/useFrontendClientLogin';
import {
  createConfigurations,
  subscribeAlertsByFrontendClient,
} from '../../utils';
import { formatTelegramForSubscription } from '../../utils/stringUtils';

export type NotifiSubscribeButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  buttonText: string;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
}>;

type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
};

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
  const frontendClientLogin = useFrontendClientLogin();

  const {
    client,
    params: { multiWallet },
    isUsingFrontendClient,
    frontendClient,
  } = useNotifiClientContext();

  const {
    cardView,
    connectedWallets,
    loading,
    setCardView,
    useDiscord,
    render,
    setLoading,
  } = useNotifiSubscriptionContext();

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const { email: emailErrorMessage, phoneNumber: smsErrorMessage } =
    formErrorMessages;

  const isMultiWallet = (multiWallet?.ownedWallets?.length ?? 0) > 0;

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

  const subscribeAlerts = useCallback(
    async (eventTypes: EventTypeConfig, inputs: Record<string, unknown>) => {
      if (isUsingFrontendClient) {
        await renewTargetGroups(targetGroup);

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
    [targetGroup, isUsingFrontendClient, frontendClient, connectedWallets],
  );

  const renewTargetGroups = useCallback(
    async (targetGroup: TargetGroupData) => {
      if (isUsingFrontendClient) {
        return frontendClient.ensureTargetGroup(targetGroup);
      }
      return updateTargetGroups();
    },
    [
      email,
      phoneNumber,
      useDiscord,
      telegramId,
      frontendClient,
      isUsingFrontendClient,
    ],
  );

  const onClick = useCallback(async () => {
    let isFirstTimeUser = (client.data?.targetGroups?.length ?? 0) === 0;
    if (
      isUsingFrontendClient &&
      frontendClient.userState?.status !== 'authenticated'
    ) {
      await frontendClientLogin();
      const data = await frontendClient.fetchData();
      isFirstTimeUser = (data.targetGroup?.length ?? 0) === 0;
    }

    setLoading(true);
    try {
      let success = false;
      if (isFirstTimeUser && !isMultiWallet) {
        const subEvents = eventTypes.filter((event) => {
          return event.optOutAtSignup ? false : true;
        });
        const result = await subscribeAlerts(subEvents, inputs);
        success = !!result;
      } else {
        const result = await renewTargetGroups(targetGroup);
        success = !!result;
      }

      if (isUsingFrontendClient && success) {
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
    frontendClient,
    isUsingFrontendClient,
    client,
    eventTypes,
    frontendClientLogin,
    subscribe,
    updateTargetGroups,
    setCardView,
  ]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const isInputFieldsValid = useMemo(() => {
    return data.isContactInfoRequired
      ? email || phoneNumber || telegramId || useDiscord
      : true;
  }, [email, phoneNumber, telegramId, useDiscord, data.isContactInfoRequired]);

  return (
    <button
      className={clsx('NotifiSubscribeButton__button', classNames?.button)}
      disabled={!isInitialized || loading || hasErrors || !isInputFieldsValid}
      onClick={onClick}
    >
      <span className={clsx('NotifiSubscribeButton__label', classNames?.label)}>
        {loading ? 'Loading' : buttonText}
      </span>
    </button>
  );
};
