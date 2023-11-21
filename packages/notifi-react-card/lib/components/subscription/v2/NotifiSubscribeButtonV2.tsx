import {
  CardConfigItemV2,
  TopicTypeItem,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useMemo } from 'react';

import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../../context';
import { useFrontendClientLogin } from '../../../hooks/useFrontendClientLogin';
import {
  createConfigurations,
  subscribeAlertsByFrontendClient,
} from '../../../utils';
import { formatTelegramForSubscription } from '../../../utils/stringUtils';

export type NotifiSubscribeButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  buttonText: string;
  data: CardConfigItemV2;
  inputs: Record<string, unknown>;
}>;

type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
};

export const NotifiSubscribeButtonV2: React.FC<NotifiSubscribeButtonProps> = ({
  buttonText,
  classNames,
  data,
  inputs,
}) => {
  const eventTypes = data.topicTypes;

  const frontendClientLogin = useFrontendClientLogin();

  const {
    params: { multiWallet },
    frontendClient,
  } = useNotifiClientContext();

  const isClientInitialized = useMemo(
    () => !!frontendClient.userState,
    [frontendClient],
  );
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

  const renewTargetGroups = useCallback(
    async (targetGroup: TargetGroupData) => {
      return frontendClient.ensureTargetGroup(targetGroup);
    },
    [frontendClient],
  );

  const subscribeAlerts = useCallback(
    async (eventTypes: TopicTypeItem[], inputs: Record<string, unknown>) => {
      await renewTargetGroups(targetGroup);

      return subscribeAlertsByFrontendClient(
        frontendClient,
        eventTypes,
        inputs,
      );
    },
    [
      targetGroup,
      frontendClient,
      connectedWallets,
      renewTargetGroups,
      subscribeAlertsByFrontendClient,
      createConfigurations,
    ],
  );

  const onClick = useCallback(async () => {
    let isFirstTimeUser = false;
    if (frontendClient.userState?.status !== 'authenticated') {
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

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
      }

      if (success === true) {
        const nextState = !isMultiWallet
          ? 'history'
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
    eventTypes,
    frontendClientLogin,
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
      data-cy="notifiSubscribeButton"
      className={clsx('NotifiSubscribeButton__button', classNames?.button)}
      disabled={
        !isClientInitialized || loading || hasErrors || !isInputFieldsValid
      }
      onClick={onClick}
    >
      <span className={clsx('NotifiSubscribeButton__label', classNames?.label)}>
        {loading ? 'Loading' : buttonText}
      </span>
    </button>
  );
};
