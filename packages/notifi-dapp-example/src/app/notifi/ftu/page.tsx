'use client';

import { FtuAlertEdit } from '@/components/FtuAlertEdit';
import { FtuTargetList } from '@/components/FtuTargetList';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
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
  const { setGlobalError } = useGlobalStateContext();

  if (!cardConfig) {
    return null;
  }

  const subscribeAndUpdateFtuStage = async () => {
    if (!targetGroupId || !frontendClientStatus.isAuthenticated) {
      setGlobalError('Missing targetGroupId or user is not authenticated');
      return;
    }
    try {
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
    } catch (error) {
      setGlobalError('Failed to subscribe and update FTU stage:');
    }
  };

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

    if (ftuStage === null) {
      subscribeAndUpdateFtuStage();
      setFtuView(FtuView.TargetList);
    } else {
      setFtuView(
        ftuStage === FtuStage.Destination
          ? FtuView.TargetList
          : FtuView.AlertEdit,
      );
    }
  }, [
    frontendClientStatus.isAuthenticated,
    isLoadingTarget,
    targetGroupId,
    isLoadingSubscribingTopics,
    ftuStage,
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
                  updateFtuStage(FtuStage.Destination);
                  setFtuView(FtuView.TargetList);
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
