import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Icon } from '../assets/Icons';

type TooltipProps = {
  tooltipRef: React.RefObject<HTMLDivElement>;
  tooltipIconPosition: string;
  classNames?: {
    container?: string;
    tooltipIcon?: string;
    tooltipContent?: string;
  };
};

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  children,
  ...props
}) => {
  return (
    <div
      className={clsx('notifi-tooltip-container', props.classNames?.container)}
      ref={props.tooltipRef}
    >
      <Icon
        className={clsx('notifi-tooltip-icon', props.classNames?.tooltipIcon)}
        type="info"
      />
      <div
        className={clsx(
          'notifi-tooltip-content',
          props.classNames?.tooltipContent,
          props.tooltipIconPosition,
        )}
      >
        {children}
      </div>
    </div>
  );
};
