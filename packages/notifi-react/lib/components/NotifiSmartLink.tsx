import clsx from 'clsx';
import React from 'react';

import {
  type ActionHandler,
  useNotifiSmartLinkContext,
} from '../context/NotifiSmartLinkContext';
import { ErrorView, ErrorViewProps } from './ErrorView';
import {
  PreAction,
  SmartLinkAction,
  SmartLinkActionProps,
} from './SmartLinkAction';

export type NotifiSmartLinkProps = {
  smartLinkId: string;
  actionHandler: ActionHandler;
  theme?: /*'dark' |*/ 'light' /* Only light is supported for now */;
  nameLogoSrc?: string;
  preAction?: PreAction;
  copy?: {
    SmartLinkAction?: SmartLinkActionProps['copy'];
  };
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
  const {
    error,
    renewSmartLinkConfigAndActionDictionary,
    smartLinkConfigDictionary,
  } = useNotifiSmartLinkContext();

  React.useEffect(() => {
    renewSmartLinkConfigAndActionDictionary(props.smartLinkId);
  }, [props.smartLinkId]);
  const smartLinkConfigWithIsActive =
    smartLinkConfigDictionary[props.smartLinkId];

  if (!smartLinkConfigWithIsActive) {
    return null;
  }

  if (error) {
    return (
      <div
        className={clsx(
          'notifi-theme-light',
          'notifi-smartlink-error',
          props.classNames?.container,
        )}
      >
        <ErrorView
          detail={error.message}
          cta={{
            icon: 'arrow-back',
            action: () => {
              renewSmartLinkConfigAndActionDictionary(props.smartLinkId);
            },
          }}
          classNames={props.classNames?.ErrorView}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        /**
         * NOTE: Currently, only light theme is supported.
         * TODO: props.theme === 'dark' ? 'notifi-theme-dark' : 'notifi-theme-light',
         */
        'notifi-theme-light',
        'notifi-smartlink',
        props.classNames?.container,
      )}
    >
      <img
        className={clsx('notifi-smartlink-banner', props.classNames?.image)}
        src={smartLinkConfigWithIsActive.smartLinkConfig.bannerImgUrl}
      />
      <div className={clsx('notifi-smartlink-name', props.classNames?.name)}>
        <img
          className={clsx(
            'notifi-smartlink-namelogo',
            props.classNames?.nameLogo,
          )}
          src={smartLinkConfigWithIsActive.smartLinkConfig.icon}
          alt="name-img"
        />
        <div className="notifi-smartlink-name-text">
          <div>{smartLinkConfigWithIsActive.smartLinkConfig.tenantName}</div>
        </div>
      </div>
      <div className={clsx('notifi-smartlink-title', props.classNames?.title)}>
        {smartLinkConfigWithIsActive.smartLinkConfig.title}
      </div>
      <div
        className={clsx(
          'notifi-smartlink-subtitle',
          props.classNames?.subtitle,
        )}
      >
        {smartLinkConfigWithIsActive.smartLinkConfig.subtitle}
      </div>

      {smartLinkConfigWithIsActive.smartLinkConfig.components.map(
        (component, id) => {
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
                  smartLinkIdWithActionId={`${props.smartLinkId}:;:${component.id}`}
                  preAction={props.preAction}
                  copy={props.copy?.SmartLinkAction}
                  classNames={props.classNames?.SmartLinkAction}
                  actionHandler={props.actionHandler}
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
                    'notifi-smartlink-image',
                    props.classNames?.smartLinkImage,
                  )}
                  src={component.src}
                />
              ) : null}
            </div>
          );
        },
      )}
    </div>
  );
};
