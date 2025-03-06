import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  getFusionEventMetadata,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React, { useCallback, useEffect } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useFtuStageUpdate = () => {
  const {
    ftuStage,
    updateFtuStage,
    isLoading: isLoadingFtu,
  } = useNotifiUserSettingContext();
  const { cardConfig, fusionEventTopics } = useNotifiTenantConfigContext();
  const eventTypes = cardConfig?.eventTypes;
  const { renewTargetGroup } = useNotifiTargetContext();

  const { handleRoute, isLoadingRouter } = useRouterAsync();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
  } = useNotifiFrontendClientContext();

  const { setGlobalError, setIsGlobalLoading } = useGlobalStateContext();

  const { subscribeAlertsDefault, isLoading: isSubscribingAlerts } =
    useNotifiTopicContext();

  const onClick = useCallback(async () => {
    if (!isAuthenticated) return;
    // setIsLoading(true);
    await renewTargetGroup();
    const targetGroups = await frontendClient.getTargetGroups();
    const targetGroupId = targetGroups.find(
      (targetGroup) => targetGroup.name === 'Default',
    )?.id;
    if (!targetGroupId) {
      setGlobalError('ERROR: Failed to get target group ID');
      // setIsLoading(false);
      return;
    }
    const subEvents = fusionEventTopics.filter((event) => {
      return event.uiConfig.optOutAtSignup ? false : true;
    });
    subEvents.forEach(async (topic) => {
      try {
        if (!ftuStage) {
          await subscribeAlertsDefault([topic], targetGroupId);

          if (cardConfig?.isContactInfoRequired) {
            await updateFtuStage(FtuStage.Destination);
          } else {
            await updateFtuStage(FtuStage.Alerts);
          }
          await handleRoute('/notifi/ftu');
        }
      } catch (e: unknown) {
        setGlobalError('ERROR: Failed to signup, please try again.');
        console.error('Failed to singup', (e as Error).message);
      } finally {
        // setIsLoading(false);
      }
    });
  }, [frontendClient, eventTypes, setGlobalError, renewTargetGroup]);

  useEffect(() => {
    if (
      !isLoadingRouter &&
      // !isLoading &&
      !isLoadingFtu &&
      !isSubscribingAlerts
    ) {
      setIsGlobalLoading(false);
      return;
    }
    setIsGlobalLoading(true);
  }, [isLoadingRouter, isLoadingFtu, isSubscribingAlerts]);

  return {
    onClick,
  };

  // const { frontendClientStatus, frontendClient } =
  //   useNotifiFrontendClientContext();
  // const {
  //   renewTargetGroup,
  //   targetDocument: { targetGroupId },
  //   isLoading: isLoadingCreateTargetGroup,
  // } = useNotifiTargetContext();
  // const {
  //   updateFtuStage,
  //   ftuStage,
  //   isLoading: isLoadingUpdateUserSetting,
  // } = useNotifiUserSettingContext();

  // const { fusionEventTopics, cardConfig } = useNotifiTenantConfigContext();
  // const { subscribeAlertsDefault, isLoading: isLoadingSubscribingTopics } =
  //   useNotifiTopicContext();
  // const [isLoading, setIsLoading] = React.useState(false);

  // React.useEffect(() => {
  //   // NOTE: Ensure no flicker at loading spinner
  //   if (!isLoading && frontendClientStatus.isAuthenticated) {
  //     setIsLoading(
  //       [
  //         isLoadingCreateTargetGroup,
  //         isLoadingUpdateUserSetting,
  //         isLoadingSubscribingTopics,
  //       ].some((loading) => loading),
  //     );
  //     return;
  //   }
  // }, [
  //   isLoadingCreateTargetGroup,
  //   isLoadingUpdateUserSetting,
  //   isLoadingSubscribingTopics,
  // ]);

  // const ensureTargetGroup = async () => {
  //   try {
  //     const isDefaultTargetExist =
  //       await validateDefaultTargetGroup(frontendClient);
  //     // ⬇ Ensure default target group is created (This should be created automatically by the backend upon new user creation). Here is just a double check.
  //     if (!isDefaultTargetExist) {
  //       await renewTargetGroup();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return;
  //   }
  // };

  // React.useEffect(() => {
  //   // Step#2: Subscribe topics (if FTU) or prompt to next view according to target group and ftu stage (After successful login: isAuthenticated === true)
  //   if (isLoadingUpdateUserSetting) return;
  //   const subscribeAndUpdateFtuStage = async () => {
  //     if (!targetGroupId || !frontendClientStatus.isAuthenticated) return;

  //     const topicsToSubscribe = fusionEventTopics.filter((topic) => {
  //       const metadata = getFusionEventMetadata(topic);
  //       const isStackableTopic =
  //         metadata?.uiConfigOverride?.isSubscriptionValueInputable ?? false;
  //       return !topic.uiConfig.optOutAtSignup && !isStackableTopic;
  //     });

  //     if (!ftuStage) {
  //       if (!isTopicsSubscriptionNotRequired) {
  //         await subscribeAlertsDefault(topicsToSubscribe, targetGroupId);
  //       }

  //       if (cardConfig?.isContactInfoRequired) {
  //         await updateFtuStage(FtuStage.Destination);
  //       } else {
  //         await updateFtuStage(FtuStage.Alerts);
  //       }
  //     }
  //   };
  //   subscribeAndUpdateFtuStage();
  // }, [
  //   targetGroupId,
  //   ftuStage,
  //   frontendClientStatus,
  //   isLoadingUpdateUserSetting,
  // ]);
  // return {
  //   ensureTargetGroup,
  //   isLoading,
  // };
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
