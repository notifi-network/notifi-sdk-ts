import clsx from 'clsx';
import React from 'react';

import { defaultCopy } from '../utils';
import { NavHeader, NavHeaderCta } from './NavHeader';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';

export type ErrorViewProps = {
  title?: string;
  detail?: string;
  cta?: NavHeaderCta;
  copy?: {
    header: string;
  };
  classNames?: {
    container?: string;
    title?: string;
    main?: string;
    detail?: string;
    footer?: string;
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
  };
};

export const ErrorView: React.FC<ErrorViewProps> = (props) => {
  return (
    <div className={clsx('notifi-error-global', props.classNames?.container)}>
      <NavHeader leftCta={props.cta}>
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
      <div className={clsx('notifi-error-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
