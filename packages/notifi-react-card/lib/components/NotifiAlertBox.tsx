import clsx from 'clsx';
import React from 'react';

import type { DeepPartialReadonly } from '../utils';
import AlertActionIcon from './AlertBox/AlertActionIcon';

export type NotifiActionProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    btnLeft: string;
    content: string;
    btnRight: string;
    iconSvg: string;
  }>;
  nameIcon?: string;
  leftIconName?: string;
  rightIconName?: string;
  onBtnLeftClick?: () => void;
  onBtnRightClick?: () => void;
}>;

const NotifiAlertBox: React.FC<React.PropsWithChildren<NotifiActionProps>> = ({
  classNames,
  children,
  onBtnLeftClick,
  onBtnRightClick,
  leftIconName,
  rightIconName = 'close',
}) => {
  return (
    <div className={clsx('NotifiAlert__container', classNames?.container)}>
      <div
        className={clsx('NotifiAlert__btn--left', classNames?.btnLeft)}
        onClick={onBtnLeftClick}
      >
        <AlertActionIcon
          name={leftIconName}
          className={clsx('NotifiAlert__iconSvg', classNames?.iconSvg)}
        />
      </div>
      <div className={clsx('NotifiAlert__content', classNames?.content)}>
        {children}
      </div>
      <div
        className={clsx('NotifiAlert__btn--right', classNames?.btnRight)}
        onClick={onBtnRightClick}
      >
        <AlertActionIcon
          name={rightIconName}
          className={clsx('NotifiAlert__iconSvg', classNames?.iconSvg)}
        />
      </div>
    </div>
  );
};

export default NotifiAlertBox;
