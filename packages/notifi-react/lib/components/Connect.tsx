import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '../context';
import { getFusionEventMetadata } from '../utils';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
import { CardModalView } from './NotifiCardModal';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';

export type ConnectProps = {
  iconType?: IconType;
  setCardModalView: React.Dispatch<React.SetStateAction<CardModalView | null>>;
  loginWithoutSubscription?: boolean;
  copy?: {
    title?: string;
    buttonText?: string;
    description?: string;
  };
  classNames?: {
    container?: string;
    main?: string;
    icon?: string;
    button?: string;
    footer?: string;
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
    loadingSpinner?: React.CSSProperties;
    title?: string;
    description?: string;
    alertsContainer?: string;
    alert?: string;
    buttonText?: string;
  };
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const { login, frontendClientStatus } = useNotifiFrontendClientContext();
  const {
    renewTargetGroup,
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const { updateFtuStage, ftuStage } = useNotifiUserSettingContext();
  const { fusionEventTopics, cardConfig } = useNotifiTenantConfigContext();
  const { subscribeAlertsDefault } = useNotifiTopicContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;

  const onClick = async () => {
    setIsLoading(true);
    const frontendClient = await login();
    if (props.loginWithoutSubscription) return;
    if (!frontendClient) return;
    const isDefaultTargetExist = await validateDefaultTargetGroup(
      frontendClient,
    );

    if (!isDefaultTargetExist) {
      await renewTargetGroup();
    }
  };

  React.useEffect(() => {
    // NOTE: Determine the next step after finish logging in
    if (props.loginWithoutSubscription) return;
    const subscribeAndUpdateFtuStage = async () => {
      if (!targetGroupId || !frontendClientStatus.isAuthenticated) return;

      const topicsToSubscribe = fusionEventTopics.filter((topic) => {
        const metadata = getFusionEventMetadata(topic);
        const isStackableTopic =
          metadata?.uiConfigOverride?.isSubscriptionValueInputable ?? false;
        return !topic.uiConfig.optOutAtSignup && !isStackableTopic;
      });

      switch (ftuStage) {
        case FtuStage.Destination:
        case FtuStage.Alerts:
          props.setCardModalView('ftu');
          break;
        case FtuStage.Done:
          props.setCardModalView('Inbox');
          break;
        default: // ftuStage === null
          await subscribeAlertsDefault(topicsToSubscribe, targetGroupId);

          if (cardConfig?.isContactInfoRequired) {
            console.log('updateFtuStage(FtuStage.Destination)');
            await updateFtuStage(FtuStage.Destination);
          } else {
            console.log('updateFtuStage(FtuStage.Alerts)');
            await updateFtuStage(FtuStage.Alerts);
          }
          break;
      }
      setIsLoading(false);
    };
    subscribeAndUpdateFtuStage();
  }, [targetGroupId, ftuStage, frontendClientStatus]);

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
    <div className={clsx('notifi-connect', props.classNames?.container)}>
      <div className={clsx('notifi-connect-title', props.classNames?.title)}>
        {props.copy?.title ?? defaultCopy.connect.title}
      </div>
      <div
        className={clsx(
          'notifi-connect-description',
          props.classNames?.description,
        )}
      >
        {props.copy?.description ?? defaultCopy.connect.description}
      </div>
      <div className={clsx('notifi-connect-main', props.classNames?.main)}>
        <div
          data-cy="notifi-connect-alert-list-container"
          className={clsx(
            'notifi-connect-alert-list-container',
            props.classNames?.alertsContainer,
          )}
        >
          {topicLists.map((topic) => {
            return (
              <div
                className={clsx(
                  'notifi-connect-alert-list-alert',
                  props.classNames?.alert,
                )}
                key={topic.value}
              >
                <Icon
                  type={props.iconType ?? 'check'}
                  className={clsx(
                    'notifi-connect-alert-icon',
                    props.classNames?.icon,
                  )}
                />
                {topic.value}
              </div>
            );
          })}
        </div>
      </div>
      <button
        data-cy="notifi-connect-button"
        className={clsx('notifi-connect-button', props.classNames?.button)}
        disabled={isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
        ) : null}
        <div
          className={clsx('notifi-connect-button-text', isLoading && 'hidden')}
        >
          {props.copy?.buttonText
            ? props.copy.buttonText
            : defaultCopy.connect.buttonText}
        </div>
      </button>

      <div className={clsx('notifi-connect-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};

// Utils

const validateDefaultTargetGroup = async (
  frontendClient: NotifiFrontendClient,
) => {
  // NOTE: this extra request is necessary as the targetGroupId state in NotifiTargetContext will not be updated constantly right after login
  const targetGroup = (
    await frontendClient?.fetchFusionData()
  )?.targetGroup?.find((group) => group?.name === 'Default');
  return !!targetGroup;
};
