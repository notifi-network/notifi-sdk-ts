import React from 'react';

import { IconType } from '../assets/Icons';
import { FormTarget, TargetInfo, ToggleTarget } from '../context';
import { isFormTarget, isToggleTarget } from '../utils';
import { TargetCtaProps } from './TargetCta';
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
  // postCta: PostCta; // TODO: remove postCta related
  iconType: IconType;
  label: string;
  targetCtaType: TargetCtaProps['type'];
  targetInfo?: TargetInfo;
  message?: TargetListItemMessage;
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

export type TargetListItemMessage = {
  beforeSignup?: string;
  beforeSignupTooltip?: string;
  beforeSignupTooltipEndingLink?: TooltipEndingLink;
  beforeVerify?: string;
  afterVerify?: string;
  beforeVerifyTooltip?: string;
  beforeVerifyTooltipEndingLink?: TooltipEndingLink;
  afterVerifyTooltip?: string;
  afterVerifyTooltipEndingLink?: TooltipEndingLink;
};

export type TooltipEndingLink = {
  text: string;
  url: string;
};

export const TargetListItem: React.FC<TargetListItemProps> = (props) => {
  if (isFormTarget(props.target))
    return <TargetListItemForm {...(props as TargetListItemFromProps)} />;

  if (isToggleTarget(props.target)) {
    return <TargetListItemToggle {...(props as TargetListItemToggleProps)} />;
  }

  return null;
};
