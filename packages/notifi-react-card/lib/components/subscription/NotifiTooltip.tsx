import clsx from 'clsx';
import React from 'react';

export type NotifiTooltipProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    icon?: string;
    tooltip?: string;
    tooltipArrow?: string;
    tooltipLabel?: string;
  }>;
  content: string;
}>;

export const NotifiTooltip: React.FC<NotifiTooltipProps> = ({
  classNames,
  content,
}: NotifiTooltipProps) => {
  return (
    <div className={clsx('NotifiTooltip__container', classNames?.container)}>
      <svg
        className={clsx('Info__icon', classNames?.icon)}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.33301 3.66683H7.66634V5.00016H6.33301V3.66683ZM6.33301 6.3335H7.66634V10.3335H6.33301V6.3335ZM6.99967 0.333496C3.31967 0.333496 0.333008 3.32016 0.333008 7.00016C0.333008 10.6802 3.31967 13.6668 6.99967 13.6668C10.6797 13.6668 13.6663 10.6802 13.6663 7.00016C13.6663 3.32016 10.6797 0.333496 6.99967 0.333496ZM6.99967 12.3335C4.05967 12.3335 1.66634 9.94016 1.66634 7.00016C1.66634 4.06016 4.05967 1.66683 6.99967 1.66683C9.93967 1.66683 12.333 4.06016 12.333 7.00016C12.333 9.94016 9.93967 12.3335 6.99967 12.3335Z"
          fill="#80829D"
        />
      </svg>
      <div className={clsx('NotifiTooltip', classNames?.tooltip)}>
        <div
          className={clsx('NotifiTooltip__arrow', classNames?.tooltipArrow)}
        />
        <div className={clsx('NotifiTooltip__label', classNames?.tooltipLabel)}>
          {content}
        </div>
      </div>
    </div>
  );
};
