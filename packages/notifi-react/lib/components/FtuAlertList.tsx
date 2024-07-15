import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  FtuStage,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '../context';
import { getFusionEventMetadata } from '../utils';
import { defaultCopy } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';

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
    loadingSpinner?: React.CSSProperties;
  };
  iconType?: IconType;
};

/** @deprecated TODO: remove this deprecated component*/
export const FtuAlertList: React.FC<FtuAlertListProps> = (props) => {
  const { fusionEventTopics, cardConfig } = useNotifiTenantConfigContext();
  const { updateFtuStage } = useNotifiUserSettingContext();
  const { subscribeAlertsDefault } = useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    setIsLoading(true);
    // NOTE: Subscribe default topics
    if (!targetGroupId) return;
    const topicsToSubscribe = fusionEventTopics.filter((topic) => {
      const metadata = getFusionEventMetadata(topic);
      const isStackableTopic =
        metadata?.uiConfigOverride?.isSubscriptionValueInputable ?? false;
      return !topic.uiConfig.optOutAtSignup && !isStackableTopic;
    });
    await subscribeAlertsDefault(topicsToSubscribe, targetGroupId);

    // NOTE: Update FTU stage
    if (cardConfig?.isContactInfoRequired) {
      updateFtuStage(FtuStage.Destination);
      return;
    }
    updateFtuStage(FtuStage.Alerts);
    setIsLoading(false);
  };

  if (!fusionEventTopics || !fusionEventTopics.length) {
    return null;
  }

  const topicLists = React.useMemo(() => {
    const topicGroupNames: { index: number; value: string }[] = [];
    const topicNames: { index: number; value: string }[] = [];
    fusionEventTopics.forEach((topic, id) => {
      if (topic.uiConfig.topicGroupName) {
        if (
          topicGroupNames
            .map((name) => name.value)
            .includes(topic.uiConfig.topicGroupName)
        )
          return;
        topicGroupNames.push({
          index: topic.uiConfig.index ?? id,
          value: topic.uiConfig.topicGroupName,
        });
        return;
      }
      topicNames.push({
        index: topic.uiConfig.index ?? id,
        value: topic.uiConfig.name,
      });
    });
    return [...topicNames, ...topicGroupNames].sort(
      (a, b) => a.index - b.index,
    );
  }, [fusionEventTopics]);

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
        data-cy="notifi-ftu-alert-list-container"
        className={clsx(
          'notifi-ftu-alert-list-container',
          props.classNames?.alertsContainer,
        )}
      >
        {topicLists.map((topic) => {
          return (
            <div
              className={clsx(
                'notifi-ftu-alert-list-alert',
                props.classNames?.alert,
              )}
              key={topic.value}
            >
              <Icon
                type={props.iconType ?? 'check'}
                className={clsx(
                  'notifi-ftu-alert-icon',
                  props.classNames?.icon,
                )}
              />
              {topic.value}
            </div>
          );
        })}
      </div>
      <button
        className={clsx(
          'notifi-ftu-alert-list-button',
          props.classNames?.buttonText,
        )}
        data-cy="notifi-ftu-alert-list-button"
        disabled={isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <LoadingAnimation
            type="spinner"
            classNames={{ spinner: 'notifi-ftu-alert-list-button-spinner' }}
          />
        ) : null}
        <div
          className={clsx(
            'notifi-ftu-alert-list-button-text',
            isLoading && 'hidden',
          )}
        >
          {props.copy?.buttonText ?? defaultCopy.ftuAlertList.buttonText}
        </div>
      </button>
    </div>
  );
};
