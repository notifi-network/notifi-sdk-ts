import clsx from 'clsx';
import React from 'react';

import { Logo } from '../assets/logos';
import { defaultCopy } from '../utils/constants';

export type PoweredByNotifiProps = {
  copy?: string;
  classNames?: {
    container?: string;
    content?: string;
    notifiLogo?: string;
    notifiText?: string;
  };
};

export const PoweredByNotifi: React.FC<PoweredByNotifiProps> = (props) => {
  return (
    <div className={clsx('powered-by-notifi', props.classNames?.container)}>
      <div
        className={clsx(
          'notifi-powered-by-notifi-content',
          props.classNames?.content,
        )}
      >
        {props.copy ?? defaultCopy.poweredByNotifi}
      </div>
      <Logo
        type="notifi"
        className={clsx('powered-by-notifi-logo', props.classNames?.notifiLogo)}
      />
      <Logo
        type="notifi-text"
        className={clsx('powered-by-notifi-text', props.classNames?.notifiText)}
      />
    </div>
  );
};
