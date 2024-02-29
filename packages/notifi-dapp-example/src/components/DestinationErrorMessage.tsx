import { NotifiTooltip } from '@notifi-network/notifi-react-card';
import React from 'react';

type Props = {
  errorMessage: string;
  tooltipContent?: string;
  onClick?: () => void;
  isButton?: boolean;
  buttonCopy?: string;
};

export const DestinationErrorMessage: React.FC<Props> = ({
  tooltipContent,
  errorMessage,
  onClick,
  isButton = false,
  buttonCopy,
}) => {
  return (
    <div>
      {onClick !== undefined ? (
        isButton ? (
          <button
            onClick={() => onClick()}
            className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-20 h-7 text-sm font-bold disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
          >
            {buttonCopy}
          </button>
        ) : (
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onClick()}
            className="text-sm font-bold text-notifi-button-primary-blueish-bg ml-6 underline cursor-pointer"
          >
            <label className="cursor-pointer">{errorMessage}</label>
          </a>
        )
      ) : (
        <label>{errorMessage}</label>
      )}
      {tooltipContent !== undefined && tooltipContent.length > 0 ? (
        <NotifiTooltip content={tooltipContent} />
      ) : null}
    </div>
  );
};
