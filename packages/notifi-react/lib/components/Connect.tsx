import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiFrontendClientContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';

export type ConnectProps = {
  copy?: {
    title?: string;
    content?: string;
    buttonText?: string;
  };
  classNames?: {
    container?: string;
    main?: string;
    icon?: string;
    header?: string;
    content?: string;
    button?: string;
    footer?: string;
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
  };
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const { login } = useNotifiFrontendClientContext();
  return (
    <div className={clsx('notifi-connect', props.classNames?.container)}>
      <div className={clsx('notifi-connect-main', props.classNames?.main)}>
        <Icon
          type="connect"
          className={clsx('notifi-connect-icon', props.classNames?.icon)}
        />
        <div className={clsx('notifi-connect-title', props.classNames?.header)}>
          {props.copy?.title ? props.copy.title : defaultCopy.connect.title}
        </div>
        <div
          className={clsx('notifi-connect-content', props.classNames?.content)}
        >
          {props.copy?.content
            ? props.copy.content
            : defaultCopy.connect.content}
        </div>
        <div
          className={clsx('notifi-connect-button', props.classNames?.button)}
          onClick={login}
        >
          {props.copy?.buttonText
            ? props.copy.buttonText
            : defaultCopy.connect.buttonText}
        </div>
      </div>

      <div className={clsx('notifi-connect-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
