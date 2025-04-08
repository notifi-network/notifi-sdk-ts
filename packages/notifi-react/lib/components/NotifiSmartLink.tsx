import {
  ExecuteSmartLinkActionArgs,
  SmartLinkConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiSmartLinkContext } from '../context/NotifiSmartLinkContext';
import { defaultCopy } from '../utils';
import { ErrorView, ErrorViewProps } from './ErrorView';
import { SmartLinkAction, SmartLinkActionProps } from './SmartLinkAction';

export type NotifiSmartLinkProps = {
  smartLinkId: string;
  actionHandler: (
    args: Omit<ExecuteSmartLinkActionArgs, 'authParams'>,
  ) => Promise<void>;
  theme?: 'dark' | 'light';
  nameLogoSrc?: string;
  classNames?: {
    container?: string;
    image?: string;
    name?: string;
    nameLogo?: string;
    title?: string;
    subtitle?: string;
    componentContainer?: string;
    smartLinkText?: string;
    smartLinkImage?: string;
    SmartLinkAction?: SmartLinkActionProps['classNames'];
    ErrorView?: ErrorViewProps['classNames'];
  };
};

export const NotifiSmartLink: React.FC<NotifiSmartLinkProps> = (props) => {
  const { fetchSmartLinkConfig, error } = useNotifiSmartLinkContext();
  // TODO: smartLink inActive flow not defined yet
  const [isSmartLinkActive, setIsSmartLinkActive] = React.useState(false);
  const [smartLinkConfig, setSmartLinkConfig] =
    React.useState<SmartLinkConfig | null>(null);

  React.useEffect(() => {
    fetchSmartLinkConfig(props.smartLinkId)
      .then((smartLinkConfigWithIsActive) => {
        if (smartLinkConfigWithIsActive) {
          setSmartLinkConfig(smartLinkConfigWithIsActive.smartLinkConfig);
          setIsSmartLinkActive(smartLinkConfigWithIsActive.isActive);
        }
      })
      .catch((error) => {
        console.error('Error fetching smart link config:', error);
      });
  }, [props.smartLinkId]);

  if (!smartLinkConfig) {
    return null;
  }

  if (error) {
    return (
      <ErrorView
        detail={error.message}
        classNames={props.classNames?.ErrorView}
      />
    );
  }

  if (!smartLinkConfig) {
    return null;
  }

  return (
    <div
      className={clsx(
        props.theme === 'dark' ? 'notifi-theme-dark' : 'notifi-theme-light',
        'notifi-smartlink',
        props.classNames?.container,
      )}
    >
      <img
        className={clsx('notifi-smartlink-banner', props.classNames?.image)}
        src={smartLinkConfig.icon}
      />
      <div className={clsx('notifi-smartlink-name', props.classNames?.name)}>
        <img
          className={clsx(
            'notifi-smartlink-namelogo',
            props.classNames?.nameLogo,
          )}
          src={props.nameLogoSrc ?? defaultCopy.smartLink.nameLogoSrc}
          alt="name-img"
        />
        <div>{smartLinkConfig.name}</div>
      </div>
      <div className={clsx('notifi-smartlink-title', props.classNames?.title)}>
        {smartLinkConfig.title}
      </div>
      <div
        className={clsx(
          'notifi-smartlink-subtitle',
          props.classNames?.subtitle,
        )}
      >
        {smartLinkConfig.subtitle}
      </div>

      {smartLinkConfig.components.map((component, id) => {
        return (
          <div
            key={id}
            className={clsx(
              'notifi-smartlink-component',
              props.classNames?.componentContainer,
            )}
          >
            {component.type === 'ACTION' ? (
              <SmartLinkAction
                action={component}
                classNames={props.classNames?.SmartLinkAction}
              />
            ) : null}
            {component.type === 'TEXT' ? (
              <div
                className={clsx(
                  'notifi-smartlink-text',
                  props.classNames?.smartLinkText,
                )}
              >
                {component.text}
              </div>
            ) : null}
            {component.type === 'IMAGE' ? (
              <img
                className={clsx(
                  // TODO: No style yet
                  'notifi-smartlink-image',
                  props.classNames?.smartLinkImage,
                )}
                src={component.src}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
