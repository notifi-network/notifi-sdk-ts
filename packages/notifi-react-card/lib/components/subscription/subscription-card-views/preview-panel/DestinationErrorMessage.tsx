import clsx from 'clsx';
import React from 'react';

import { NotifiTooltip } from '../../NotifiTooltip';

type Props = {
  classNames?: {
    errorMessageContainer?: string;
    tooltipContent?: string;
    errorMessage?: string;
  };
  errorMessage: string;
  tooltipContent?: string;
  onClick?: () => void;
};

export const DestinationErrorMessage: React.FC<Props> = ({
  classNames,
  tooltipContent,
  errorMessage,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'DestinationErrorMessage__ErrorMessageContainer',
        classNames?.errorMessageContainer,
      )}
    >
      {onClick !== undefined ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick()}
          className={clsx('DestinationErrorMessage__emailConfirmationLink')}
        >
          <label
            className={clsx(
              'DestinationErrorMessage__confirmationLinkLabel',
              classNames?.errorMessage,
            )}
          >
            {errorMessage}
          </label>
        </a>
      ) : (
        <label
          className={clsx(
            'DestinationErrorMessage__ErrorMessageLabel',
            classNames?.errorMessage,
            {
              DestinationErrorMessage__errorMessage: errorMessage !== '',
            },
          )}
        >
          {errorMessage}
        </label>
      )}
      {tooltipContent !== undefined && tooltipContent.length > 0 ? (
        <NotifiTooltip
          classNames={{
            icon: clsx(
              'DestinationErrorMessage__tooltipIcon',
              classNames?.tooltipContent,
            ),
          }}
          content={tooltipContent}
        />
      ) : null}
    </div>
  );
};
