import clsx from 'clsx';
import React from 'react';

import type { DeepPartialReadonly } from '../utils';
import AlertActionIcon, {
  AlertActionIconProps,
} from './AlertBox/AlertActionIcon';

export type NotifiAlertBoxButtonProps = Readonly<{
  name: AlertActionIconProps['name'];
  onClick: () => void;
}>;

export type NotifiAlertBoxProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    btnLeft: string;
    content: string;
    btnRight: string;
    iconSvg: string;
    spacer: string;
  }>;
  leftIcon?: NotifiAlertBoxButtonProps;
  rightIcon?: NotifiAlertBoxButtonProps;
}>;

const NotifiAlertBox: React.FC<
  React.PropsWithChildren<NotifiAlertBoxProps>
> = ({ classNames, children, leftIcon, rightIcon }) => {
  return (
    <div className={clsx('NotifiAlertBox__container', classNames?.container)}>
      {leftIcon !== undefined ? (
        <div
          className={clsx('NotifiAlertBox__btn--left', classNames?.btnLeft)}
          onClick={leftIcon.onClick}
        >
          <AlertActionIcon
            name={leftIcon.name}
            className={clsx('NotifiAlertBox__iconSvg', classNames?.iconSvg)}
          />
        </div>
      ) : (
        <div
          className={clsx('NotifiAlertBox__btn--spacer', classNames?.spacer)}
        />
      )}
      <div className={clsx('NotifiAlertBox__content', classNames?.content)}>
        {children}
      </div>
      {rightIcon !== undefined ? (
        <div
          className={clsx('NotifiAlertBox__btn--right', classNames?.btnRight)}
          onClick={rightIcon.onClick}
        >
          <AlertActionIcon
            name={rightIcon.name}
            className={clsx('NotifiAlertBox__iconSvg', classNames?.iconSvg)}
          />
        </div>
      ) : (
        <div
          className={clsx('NotifiAlertBox__btn--spacer', classNames?.spacer)}
        />
      )}
    </div>
  );
};

export default NotifiAlertBox;
