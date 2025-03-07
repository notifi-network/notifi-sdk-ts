import { SpriteIconId } from '@/assets/Icon';
import {
  FormTarget,
  TargetInfo,
  ToggleTarget,
  isFormTarget,
  isToggleTarget,
} from '@notifi-network/notifi-react';
import React from 'react';

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
  iconType: SpriteIconId;
  label: string;
  targetCtaType: TargetCtaProps['type'];
  targetInfo?: TargetInfo;
  message?: TargetListItemMessage;
  parentComponent?: 'inbox' | 'ftu';
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
