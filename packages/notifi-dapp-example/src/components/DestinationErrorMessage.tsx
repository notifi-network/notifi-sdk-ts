import { NotifiTooltip } from '@notifi-network/notifi-react-card';
import clsx from 'clsx';
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
          <button className="rounded bg-black text-notifi-button-primary-text w-20 h-7 text-sm font-bold">
            {buttonCopy}
          </button>
        ) : (
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onClick()}
            className="text-sm font-bold text-blue-500 ml-6 underline"
          >
            <label>{errorMessage}</label>
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
