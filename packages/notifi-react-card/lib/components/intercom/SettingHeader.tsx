import clsx from 'clsx';
import React from 'react';

import { BackArrow } from '../../assets/BackArrow';
import { useNotifiSubscriptionContext } from '../../context';

export type SettingHeaderProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
  }>;
}>;

export const SettingHeader: React.FC<SettingHeaderProps> = ({ classNames }) => {
  const { setIntercomCardView } = useNotifiSubscriptionContext();
  const handleClick = () => {
    setIntercomCardView({ state: 'chatWindowView' });
  };
  return (
    <div
      className={clsx('NotifiIntercomHeader__container', classNames?.container)}
    >
      <div className={'NotifiIntercomHeader__leftContainer'}>
        <div
          onClick={handleClick}
          className={'NotifiIntercomSettingHeader__backArrow'}
        >
          <BackArrow />
        </div>
        <div
          className={clsx('NotifiIntercomHeader__content', classNames?.content)}
        >
          Settings
        </div>
      </div>
    </div>
  );
};
