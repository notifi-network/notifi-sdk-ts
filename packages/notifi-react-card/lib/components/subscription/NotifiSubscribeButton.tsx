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

  const { cardView, connectedWallets, loading, setCardView, demoPreview } =
    useNotifiSubscriptionContext();

  const clientContext = demoPreview ? null : useNotifiClientContext();

  const subscribe = demoPreview
    ? null
    : useNotifiSubscribe({
        targetGroupName: 'Default',
      });

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const { email: emailErrorMessage, phoneNumber: smsErrorMessage } =
    formErrorMessages;

  const isMultiWallet =
    (clientContext?.params.multiWallet?.ownedWallets?.length ?? 0) > 0;

  const onClick = useCallback(async () => {
    if (!subscribe || !clientContext) return;
    const { data: notifiClientData } = clientContext.client;
    const targetGroupLength = notifiClientData?.targetGroups?.length ?? 0;

    const isFirstTimeUser = targetGroupLength === 0;

    let success = false;
    if (isFirstTimeUser && !isMultiWallet) {
      const alertConfigs = createConfigurations(
        eventTypes,
        inputs,
        connectedWallets,
      );
      const result = await subscribe.subscribe(alertConfigs);
      success = !!result;
    } else {
      const result = await subscribe.updateTargetGroups();
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
  }, [
    isMultiWallet,
    clientContext?.client,
    eventTypes,
    subscribe?.subscribe,
    subscribe?.updateTargetGroups,
    setCardView,
  ]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';

  return (
    <button
      className={clsx('NotifiSubscribeButton__button', classNames?.button)}
      disabled={
        !subscribe?.isInitialized ||
        loading ||
        hasErrors ||
        (!email && !phoneNumber && !telegramId)
      }
      onClick={onClick}
    >
      <span className={clsx('NotifiSubscribeButton__label', classNames?.label)}>
        {buttonText}
      </span>
    </button>
  );
};
