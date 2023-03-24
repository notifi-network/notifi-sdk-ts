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
};

export const DestinationErrorMessage: React.FC<Props> = ({
  classNames,
  tooltipContent,
  errorMessage,
}) => {
  return (
    <div
      className={clsx(
        'NotifiUserInfoPanel__ErrorMessageContainer',
        classNames?.errorMessageContainer,
      )}
    >
      {errorMessage !== '' ? (
        <label
          className={clsx(
            'NotifiUserInfoPanel__ErrorMessageLabel',
            classNames?.errorMessage,
            {
              NotifiUserInfoPanel__errorMessage: errorMessage !== '',
            },
          )}
        >
          {errorMessage}
        </label>
      ) : null}
      {tooltipContent !== undefined && tooltipContent.length > 0 ? (
        <NotifiTooltip
          classNames={{
            icon: clsx(
              'UserInfoPanel__tooltipIcon',
              classNames?.tooltipContent,
            ),
          }}
          content={tooltipContent}
        />
      ) : null}
    </div>
  );
};
