import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Icon, IconType } from '../assets/Icons';
import { Cta, useGlobalStateContext } from '../context/GlobalStateContext';

export type NavHeaderCta = {
  icon: IconType;
  action: () => void;
};

export type NavHeaderRightCta = {
  icon: IconType;
  globalCtaType: Cta;
};

export type NavHeaderProps = {
  leftCta?: NavHeaderCta;
  rightCta?: NavHeaderRightCta;
  classNames?: {
    container?: string;
  };
};

export const NavHeader: React.FC<PropsWithChildren<NavHeaderProps>> = (
  props,
) => {
  const { globalCtas } = useGlobalStateContext();

  return (
    <div className={clsx('notifi-nav-header', props.classNames?.container)}>
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
      {props.rightCta && globalCtas?.[props.rightCta.globalCtaType] ? (
        <div
          className="notifi-nav-header-right-cta"
          onClick={() => globalCtas[props.rightCta!.globalCtaType]()}
        >
          <Icon type={props.rightCta?.icon} />
        </div>
      ) : null}
    </div>
  );
};
