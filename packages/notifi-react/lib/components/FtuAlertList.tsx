import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  FtuStage,
  useNotifiTenantConfigContext,
  useNotifiUserSettingContext,
} from '../context';
import { defaultCopy } from '../utils/constants';
import { LoadingGlobal } from './LoadingGlobal';

export type FtuAlertListProps = {
  copy?: {
    title?: string;
    description?: string;
    buttonText?: string;
  };
  classNames?: {
    container?: string;
    title?: string;
    icon?: string;
    description?: string;
    alertsContainer?: string;
    alert?: string;
    buttonText?: string;
  };
  iconType?: IconType;
};

export const FtuAlertList: React.FC<FtuAlertListProps> = (props) => {
  const { fusionEventTopics, cardConfig } = useNotifiTenantConfigContext();
  const { updateFtuStage, isLoading: isLoadingFtu } =
    useNotifiUserSettingContext();

  if (isLoadingFtu) {
    return <LoadingGlobal />;
  }

  return (
    <div className={clsx('notifi-ftu-alert-list', props.classNames)}>
      <div
        className={clsx('notifi-ftu-alert-list-title', props.classNames?.title)}
      >
        {props.copy?.title ?? defaultCopy.ftuAlertList.title}
      </div>
      <div
        className={clsx(
          'notifi-ftu-alert-list-description',
          props.classNames?.description,
        )}
      >
        {props.copy?.description ?? defaultCopy.ftuAlertList.description}
      </div>
      <div
        className={clsx(
          'notifi-ftu-alert-list-container',
          props.classNames?.alertsContainer,
        )}
      >
        {fusionEventTopics.map((topic) => {
          return (
            <div
              className={clsx(
                'notifi-ftu-alert-list-alert',
                props.classNames?.alert,
              )}
              key={topic.uiConfig.name}
            >
              <Icon
                type={props.iconType ?? 'check'}
                className={clsx(
                  'notifi-ftu-alert-icon',
                  props.classNames?.icon,
                )}
              />
              {topic.uiConfig.name}
            </div>
          );
        })}
      </div>
      <div
        className={clsx(
          'notifi-ftu-alert-list-button',
          props.classNames?.buttonText,
        )}
        onClick={() => {
          if (cardConfig?.isContactInfoRequired) {
            updateFtuStage(FtuStage.Destination);
            return;
          }
          updateFtuStage(FtuStage.Alerts);
        }}
      >
        {props.copy?.buttonText ?? defaultCopy.ftuAlertList.buttonText}
      </div>
    </div>
  );
};
