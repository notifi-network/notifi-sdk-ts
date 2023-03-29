import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import { useNotifiSubscribe } from 'notifi-react-card/lib/hooks';
import React from 'react';

export type ExpiredTokenViewCardProps = {
  classNames?: {
    container?: string;
    title?: string;
    subtitle?: string;
    button?: string;
    buttonLabel?: string;
  };
};

export const ExpiredTokenView: React.FC<ExpiredTokenViewCardProps> = ({
  classNames,
}) => {
  // const { demoPreview } = useNotifiSubscriptionContext();
  const subscribe = useNotifiSubscribe({ targetGroupName: 'Default' });

  const { setCardView } = useNotifiSubscriptionContext();
  const handleClick = async () => {
    let success = false;
    const result = await subscribe.logIn();
    success = !!result;

    if (success === true) {
      setCardView({ state: 'preview' });
    }
  };

  return (
    <div
      className={clsx(
        'NotifiExpiredTokenCard__container',
        classNames?.container,
      )}
    >
      <div className={clsx('NotifiExpiredTokenCard__title', classNames?.title)}>
        Connect to Notifi
      </div>
      <div
        className={clsx(
          'NotifiExpiredTokenCard__subtitle',
          classNames?.subtitle,
        )}
      >
        It's been a while! Connect to Notifi to load your <br />
        notification details.
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
          Connect to Notifi
        </span>
      </button>
    </div>
  );
};
