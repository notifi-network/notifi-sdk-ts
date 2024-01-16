import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React, { useMemo } from 'react';

import { NavbarIcon } from '../NotifiIcons';

export type NotifiNavBarProps = Readonly<{
  classNames?: Readonly<{
    navbarContainer?: string;
    icon?: string;
  }>;
}>;

export const NotifiNavBar: React.FC<NotifiNavBarProps> = ({ classNames }) => {
  const { cardView, setCardView } = useNotifiSubscriptionContext();
  const selectedNavBarTab = useMemo(() => {
    switch (cardView.state) {
      case 'history':
      case 'historyDetail':
        return 'bell';
      case 'preview':
        return 'gear';
    }
  }, [cardView.state]);
  return (
    <div className={clsx('navbar__container', classNames?.navbarContainer)}>
      <div onClick={() => setCardView({ state: 'history' })}>
        <NavbarIcon
          icon={
            selectedNavBarTab === 'bell'
              ? 'NavbarIconBellEnabled'
              : 'NavbarIconBellDisabled'
          }
          className={clsx('NotifiNavBar__icon', classNames?.icon)}
        />
      </div>
      <div onClick={() => setCardView({ state: 'preview' })}>
        <NavbarIcon
          className={clsx('NotifiNavBar__icon', classNames?.icon)}
          icon={
            selectedNavBarTab === 'gear'
              ? 'NavbarIconGearEnabled'
              : 'NavbarIconGearDisabled'
          }
        />
      </div>
    </div>
  );
};
