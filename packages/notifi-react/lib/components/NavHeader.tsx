import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Icon, IconType } from '../assets/Icons';
import { useGlobalStateContext } from '../context/GlobalStateContext';

export type NavHeaderCta = {
  icon: IconType;
  action: () => void;
};

export type NavHeaderProps = {
  leftCta?: NavHeaderCta;
  rightCta?: NavHeaderCta;
};

export const NavHeader: React.FC<PropsWithChildren<NavHeaderProps>> = (
  props,
) => {
  const { globalCtas } = useGlobalStateContext();

  return (
    <div className="notifi-nav-header">
      <div
        className="notifi-nav-header-left-cta"
        onClick={() => props.leftCta?.action()}
      >
        {props.leftCta?.icon ? <Icon type={props.leftCta?.icon} /> : null}
      </div>
      <div
        className={clsx(
          'notifi-nav-header-title',
          props.children ? '' : 'isEmpty',
        )}
      >
        <div>{props.children}</div>
      </div>
      <div
        className="notifi-nav-header-right-cta"
        onClick={() => props.rightCta?.action() ?? globalCtas?.onClose?.()}
      >
        {props.rightCta?.icon ? (
          <Icon type={props.rightCta?.icon} />
        ) : globalCtas?.onClose ? (
          <Icon type={'close'} />
        ) : null}
      </div>
    </div>
  );
};
