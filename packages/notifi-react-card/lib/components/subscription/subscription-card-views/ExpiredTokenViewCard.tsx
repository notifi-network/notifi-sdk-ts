import clsx from 'clsx';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from 'notifi-react-card/lib/context';
import React from 'react';

import { useNotifiSubscribe } from '../../../hooks';
import { useFrontendClientLogin } from '../../../hooks/useFrontendClientLogin';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../../NotifiAlertBox';

export type ExpiredTokenViewCardProps = {
  classNames?: {
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    dividerLine?: string;
    container?: string;
    title?: string;
    subtitle?: string;
    button?: string;
    buttonLabel?: string;
  };
  copy?: {
    contentTitle?: string;
    contentBody?: string;
    buttonText?: string;
  };
  headerRightIcon?: NotifiAlertBoxButtonProps;
  headerTitle?: string;
};

export const ExpiredTokenView: React.FC<ExpiredTokenViewCardProps> = ({
  classNames,
  headerRightIcon,
  headerTitle,
  copy,
}) => {
  const { logIn } = useNotifiSubscribe({ targetGroupName: 'Default' });
  const { isUsingFrontendClient } = useNotifiClientContext();

  const { setCardView } = useNotifiSubscriptionContext();

  const frontendClientLogin = useFrontendClientLogin();

  const handleClick = async () => {
    let success = false;
    const result = isUsingFrontendClient
      ? await frontendClientLogin()
      : await logIn();

    success = !!result;

    if (success === true) {
      setCardView({ state: 'preview' });
    }
  };

  return (
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        rightIcon={headerRightIcon}
      >
        <h2>{headerTitle}</h2>
      </NotifiAlertBox>
      <div className={clsx('DividerLine expired', classNames?.dividerLine)} />
      <div
        className={clsx(
          'NotifiExpiredTokenCard__container',
          classNames?.container,
        )}
      >
        <div
          className={clsx('NotifiExpiredTokenCard__title', classNames?.title)}
        >
          {copy?.contentTitle ?? 'Connect to Notifi'}
        </div>
        <div
          className={clsx(
            'NotifiExpiredTokenCard__subtitle',
            classNames?.subtitle,
          )}
        >
          {copy?.contentBody ??
            "It's been a while! Connect to Notifi to load your notification details."}
        </div>
        <button
          className={clsx('NotifiExpiredTokenCard__button', classNames?.button)}
          onClick={handleClick}
        >
          <span
            className={clsx(
              'NotifiExpiredTokenCard__buttonLabel',
              classNames?.buttonLabel,
            )}
          >
            {copy?.buttonText ?? 'Connect to Notifi'}
          </span>
        </button>
      </div>
    </>
  );
};
