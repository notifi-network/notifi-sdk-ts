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
        className={clsx('NotifiTooltip__infoIcon', classNames?.icon)}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 7H11V5H9V7ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C3.85752 17.9997 4.95991 18.7362 6.17317 19.2388C7.38642 19.7413 8.68678 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0ZM9 15H11V9H9V15Z"
          fill="inherit"
        />
      </svg>
      <div className={clsx('NotifiTooltip__body', classNames?.tooltip)}>
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
