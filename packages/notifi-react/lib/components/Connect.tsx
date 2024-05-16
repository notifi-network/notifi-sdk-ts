import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import {
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
} from '../context';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
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
    loadingSpinner?: React.CSSProperties;
  };
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const { login } = useNotifiFrontendClientContext();
  const {
    renewTargetGroup,
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  const onClick = async () => {
    setIsLoading(true);
    await login();
    !targetGroupId && (await renewTargetGroup());
    setIsLoading(false);
  };
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
        <button
          className={clsx('notifi-connect-button', props.classNames?.button)}
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
          ) : null}
          <div
            className={clsx(
              'notifi-connect-button-text',
              isLoading && 'hidden',
            )}
          >
            {props.copy?.buttonText
              ? props.copy.buttonText
              : defaultCopy.connect.buttonText}
          </div>
        </button>
      </div>

      <div className={clsx('notifi-connect-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
