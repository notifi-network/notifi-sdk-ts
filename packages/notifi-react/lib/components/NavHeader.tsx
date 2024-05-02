import React, { PropsWithChildren } from 'react';

import { Icon, IconType } from '../assets/Icons';

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
  return (
    <div className="notifi-nav-header">
      <div
        className="notifi-nav-header-left-cta"
        onClick={() => props.leftCta?.action()}
      >
        {props.leftCta?.icon ? <Icon type={props.leftCta?.icon} /> : null}
      </div>
      <div className="notifi-nav-header-title">
        <div>{props.children}</div>
      </div>
      <div
        className="notifi-nave-header-right-cta"
        onClick={() => props.rightCta?.action()}
      >
        {props.rightCta?.icon ? <Icon type={props.rightCta?.icon} /> : null}
      </div>
    </div>
  );
};
