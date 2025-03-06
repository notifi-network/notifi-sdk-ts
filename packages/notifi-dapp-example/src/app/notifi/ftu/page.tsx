'use client';

import { FtuAlertEdit } from '@/components/FtuAlertEdit';
import { FtuTargetList } from '@/components/FtuTargetList';
import {
  FusionEventMetadata,
  FusionEventTopic,
} from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  isFusionEventMetadata,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';
import { useEffect } from 'react';

export enum FtuView {
  TargetList = 'list',
  AlertEdit = 'alertEdit',
}

export default function NotifiFTU() {
  const { ftuStage } = useNotifiUserSettingContext();
  const { cardConfig, fusionEventTopics } = useNotifiTenantConfigContext();
  const { subscribeAlertsDefault, isLoading: isLoadingSubscribingTopics } =
    useNotifiTopicContext();
  const {
    isLoading: isLoadingTarget,
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const { updateFtuStage } = useNotifiUserSettingContext();
  const [ftuView, setFtuView] = React.useState<FtuView | null>(null);
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const isInitialLoaded = React.useRef(false);

  if (!cardConfig) {
    return null;
  }

  useEffect(() => {
    if (
      !frontendClientStatus.isAuthenticated ||
      isLoadingTarget ||
      isInitialLoaded.current ||
      !targetGroupId ||
      isLoadingSubscribingTopics
    )
      return;
    isInitialLoaded.current = true;

    const subscribeAndUpdateFtuStage = async () => {
      if (!targetGroupId || !frontendClientStatus.isAuthenticated) return;

      const topicsToSubscribe = fusionEventTopics.filter((topic) => {
        const metadata = getFusionEventMetadata(topic);
        const isStackableTopic =
          metadata?.uiConfigOverride?.isSubscriptionValueInputable ?? false;
        return !topic.uiConfig.optOutAtSignup && !isStackableTopic;
      });
      await subscribeAlertsDefault(topicsToSubscribe, targetGroupId);

      if (cardConfig?.isContactInfoRequired) {
        await updateFtuStage(FtuStage.Destination);
      } else {
        await updateFtuStage(FtuStage.Alerts);
      }
    };

    if (ftuStage === null) {
      subscribeAndUpdateFtuStage();
      setFtuView(FtuView.TargetList);
      updateFtuStage(FtuStage.Destination);
    } else if (ftuStage === FtuStage.Destination) {
      setFtuView(FtuView.TargetList);
      return;
    } else {
      setFtuView(FtuView.AlertEdit);
      return;
    }
  }, [
    frontendClientStatus.isAuthenticated,
    isLoadingTarget,
    targetGroupId,
    isLoadingSubscribingTopics,
    ftuStage,
    cardConfig,
    fusionEventTopics,
    subscribeAlertsDefault,
    updateFtuStage,
  ]);

  if (!ftuView) return null;

  return (
    <>
      {ftuView === FtuView.TargetList ? (
        <FtuTargetList
          onClickNext={() => setFtuView(FtuView.AlertEdit)}
          contactInfo={cardConfig.contactInfo}
        />
      ) : null}
      {ftuView === FtuView.AlertEdit ? (
        <FtuAlertEdit
          onClickBack={
            cardConfig?.isContactInfoRequired
              ? () => {
                  if (cardConfig?.isContactInfoRequired) {
                    updateFtuStage(FtuStage.Destination);
                    setFtuView(FtuView.TargetList);
                    return;
                  }
                }
              : undefined
          }
        />
      ) : null}
    </>
  );
}

export const getFusionEventMetadata = (
  topic: FusionEventTopic,
): FusionEventMetadata | null => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (isFusionEventMetadata(parsedMetadata)) {
    return parsedMetadata;
  }
  return null;
};
