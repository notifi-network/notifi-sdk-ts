import clsx from 'clsx';
import React, { useCallback } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { useNotifiSubscribe } from '../../hooks';

export type NotifiSubscribeButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
}>;

export const NotifiSubscribeButton: React.FC<NotifiSubscribeButtonProps> = ({
  classNames,
}) => {
  const { isInitialized, subscribe } = useNotifiSubscribe();

  const {
    alerts,
    loading,
    emailErrorMessage,
    smsErrorMessage,
    setCardView,
    email,
    phoneNumber,
    telegramId,
  } = useNotifiSubscriptionContext();
  const hasAlerts = Object.values(alerts ?? {}).find(
    (it) => it?.id !== undefined && it?.id !== null,
  );

  const onClick = useCallback(async () => {
    const result = await subscribe();
    if (result) {
      setCardView({ state: 'preview' });
    }
  }, [subscribe]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';

  const copy = hasAlerts ? 'Update' : 'Subscribe';
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
        {copy}
      </span>
    </button>
  );
};
