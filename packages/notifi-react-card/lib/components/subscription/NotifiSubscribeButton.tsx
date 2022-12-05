import clsx from 'clsx';
import React, { useCallback } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { createConfigurations } from '../../utils';

export type NotifiSubscribeButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  buttonText?: string;
  data: CardConfigItemV1;
}>;

export const NotifiSubscribeButton: React.FC<NotifiSubscribeButtonProps> = ({
  buttonText,
  classNames,
  data,
}) => {
  const eventTypes = data.eventTypes;
  const { isInitialized, subscribe, updateTargetGroups } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { client } = useNotifiClientContext();

  const {
    email,
    emailErrorMessage,
    loading,
    phoneNumber,
    setCardView,
    smsErrorMessage,
    telegramId,
  } = useNotifiSubscriptionContext();

  const onClick = useCallback(async () => {
    const { data: notifiClientData } = client;
    const targetGroupLength = notifiClientData?.targetGroups?.length ?? 0;

    const isFirstTimeUser = targetGroupLength === 0;

    let success = false;
    if (isFirstTimeUser) {
      const alertConfigs = createConfigurations(eventTypes);
      const result = await subscribe(alertConfigs);
      success = !!result;
    } else {
      const result = await updateTargetGroups();
      success = !!result;
    }

    if (success === true) {
      setCardView({ state: 'preview' });
    }
  }, [client, eventTypes, subscribe, updateTargetGroups, setCardView]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';

  const buttonLabel = buttonText ?? 'Next';
  return (
    <button
      className={clsx('NotifiSubscribeButton__button', classNames?.button)}
      disabled={
        !isInitialized ||
        loading ||
        hasErrors ||
        (!email && !phoneNumber && !telegramId)
      }
      onClick={onClick}
    >
      <span className={clsx('NotifiSubscribeButton__label', classNames?.label)}>
        {buttonLabel}
      </span>
    </button>
  );
};
