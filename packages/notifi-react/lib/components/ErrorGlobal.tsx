import clsx from 'clsx';
import React from 'react';

import { useGlobalStateContext } from '../context/GlobalStateContext';
import { defaultCopy } from '../utils';
import { NavHeader } from './NavHeader';

export type ErrorGlobalProps = {
  title?: string;
  detail?: string;
  copy?: {
    header: string;
  };
  classNames?: {
    container?: string;
    title?: string;
    main?: string;
    detail?: string;
  };
};

export const ErrorGlobal: React.FC<ErrorGlobalProps> = (props) => {
  const { globalError } = useGlobalStateContext();
  return (
    <div className={clsx('notifi-error-global', props.classNames?.container)}>
      <NavHeader>
        {props.copy?.header ?? defaultCopy.errorGlobal.header}
      </NavHeader>
      <div
        className={clsx(
          'notifi-error-global-error-title',
          props.classNames?.title,
        )}
      >
        {props.title ?? defaultCopy.errorGlobal.title}
      </div>
      <div
        className={clsx(
          'notifi-error-global-error-main',
          props.classNames?.main,
        )}
      >
        <div
          className={clsx(
            'notifi-error-global-error-detail',
            props.classNames?.detail,
          )}
        >
          {props.detail ?? defaultCopy.errorGlobal.detail}
        </div>
      </div>

      <div>{globalError?.errorData ? globalError?.errorData : null}</div>
    </div>
  );
};
