import {
  ExecuteSmartLinkActionArgs,
  SmartLinkConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiSmartLinkContext } from '../context/NotifiSmartLinkContext';
import { ErrorView } from './ErrorView';
import { SmartLinkAction } from './SmartLinkAction';

export type NotifiSmartLinkProps = {
  smartLinkId: string;
  actionHandler: (
    args: Omit<ExecuteSmartLinkActionArgs, 'authParams'>,
  ) => Promise<void>;
  classNames?: {
    container?: string;
    image?: string;
    name?: string;
    title?: string;
    subtitle?: string;
    componentContainer?: string;
  };
};

export const NotifiSmartLink: React.FC<NotifiSmartLinkProps> = (props) => {
  const { fetchSmartLinkConfig, error, isLoading } =
    useNotifiSmartLinkContext();
  const [smartLinkConfig, setSmartLinkConfig] =
    React.useState<SmartLinkConfig | null>(null);

  React.useEffect(() => {
    fetchSmartLinkConfig(props.smartLinkId)
      .then((config) => {
        if (config) {
          setSmartLinkConfig(config);
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
    // TODO: customize error style
    return <ErrorView />;
  }

  if (!smartLinkConfig) {
    return null;
  }

  return (
    <div
      className={clsx('notifi-smartlink', props.classNames?.container)}
      onClick={() => console.log(smartLinkConfig)}
    >
      <img
        className={clsx('notifi-smartlink-image', props.classNames?.image)}
        src={smartLinkConfig.icon}
      />
      <div className={clsx('notifi-smartlink-name', props.classNames?.name)}>
        {smartLinkConfig.name}
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
              <SmartLinkAction action={component} />
            ) : null}
            {component.type === 'TEXT' ? <div>{component.text}</div> : null}
            {component.type === 'IMAGE' ? <img src={component.src} /> : null}
          </div>
        );
      })}
    </div>
  );
};
