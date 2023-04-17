import clsx from 'clsx';
import React, { useCallback } from 'react';

import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { createConfigurations } from '../../utils';

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
  } = useNotifiClientContext();

  const { cardView, connectedWallets, loading, setCardView, useDiscord } =
    useNotifiSubscriptionContext();

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const { email: emailErrorMessage, phoneNumber: smsErrorMessage } =
    formErrorMessages;

  const isMultiWallet = (multiWallet?.ownedWallets?.length ?? 0) > 0;

  const onClick = useCallback(async () => {
    const { data: notifiClientData } = client;
    const targetGroupLength = notifiClientData?.targetGroups?.length ?? 0;

    const isFirstTimeUser = targetGroupLength === 0;

    try {
      let success = false;

      if (isFirstTimeUser && !isMultiWallet) {
        const alertConfigs = createConfigurations(
          eventTypes,
          inputs,
          connectedWallets,
        );

        const result = await subscribe(alertConfigs);
        success = !!result;
      } else {
        const result = await updateTargetGroups();
        success = !!result;
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
