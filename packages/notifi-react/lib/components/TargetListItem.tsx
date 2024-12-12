import React from 'react';

import { IconType } from '../assets/Icons';
import { FormTarget, TargetInfo, ToggleTarget } from '../context';
import { isFormTarget, isToggleTarget } from '../utils';
import { PostCta, TargetCtaProps } from './TargetCta';
import { TargetListItemForm } from './TargetListItemForm';
import { TargetListItemToggle } from './TargetListItemToggle';

export type TargetListItemProps =
  | TargetListItemToggleProps
  | TargetListItemFromProps;
export type TargetListItemToggleProps = TargetListItemPropsBase & {
  target: ToggleTarget;
};
export type TargetListItemFromProps = TargetListItemPropsBase & {
  target: FormTarget;
};

type TargetListItemPropsBase = {
  targetListRef: React.RefObject<HTMLDivElement>;
  postCta: PostCta;
  iconType: IconType;
  label: string;
  targetCtaType: TargetCtaProps['type'];
  targetInfo?: TargetInfo;
  message?: {
    beforeVerify?: string;
    afterVerify?: string;
    beforeVerifyTooltip?: string;
    beforeVerifyTooltipEndingLink?: {
      text: string;
      url: string;
    };
    afterVerifyTooltip?: string;
    afterVerifyTooltipEndingLink?: {
      text: string;
      url: string;
    };
  };
  parentComponent?: 'inbox' | 'ftu';
  classNames?: {
    targetListItem?: string;
    targetListVerifiedItem?: string;
    targetListItemTarget?: string;
    icon?: string;
    removeCta?: string;
    verifyMessage?: string;
    tooltipIcon?: string;
    tooltipContent?: string;
    targetId?: string;
    TargetCta?: TargetCtaProps['classNames'];
  };
};

export const TargetListItem: React.FC<TargetListItemProps> = (props) => {
  if (isFormTarget(props.target))
    return <TargetListItemForm {...(props as TargetListItemFromProps)} />;

  if (isToggleTarget(props.target)) {
    return <TargetListItemToggle {...(props as TargetListItemToggleProps)} />;
  }

  return null;
};
