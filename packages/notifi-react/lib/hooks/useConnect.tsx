import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { CardModalView } from '../components';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '../context';
import { getFusionEventMetadata } from '../utils';

export const useConnect = (
  afterConnected: (cardModalView: CardModalView) => void,
  isTopicsSubscriptionNotRequired?: boolean,
) => {
  const {
    login,
    frontendClientStatus,
    loginViaHardwareWallet,
    isLoading: isLoadingLogin,
    error: loginError,
  } = useNotifiFrontendClientContext();
  const {
    renewTargetGroup,
    targetDocument: { targetGroupId },
    isLoading: isLoadingCreateTargetGroup,
  } = useNotifiTargetContext();
  const {
    updateFtuStage,
    ftuStage,
    isLoading: isLoadingUpdateUserSetting,
  } = useNotifiUserSettingContext();
  const [useHardwareWalletLogin, setUseHardwareWalletLogin] =
    React.useState(false);
  const { fusionEventTopics, cardConfig } = useNotifiTenantConfigContext();
  const { subscribeAlertsDefault, isLoading: isLoadingSubscribingTopics } =
    useNotifiTopicContext();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // NOTE: Ensure no flicker at loading spinner
    if (isLoadingLogin) {
      setIsLoading(true);
      return;
    }
    if (!isLoading && frontendClientStatus.isAuthenticated) {
      setIsLoading(
        [
          isLoadingCreateTargetGroup,
          isLoadingUpdateUserSetting,
          isLoadingSubscribingTopics,
        ].some((loading) => loading),
      );
      return;
    }
    if (loginError) {
      // NOTE: other types of error are handled in NotifiCardModal.tsx
      setIsLoading(false);
    }
  }, [
    isLoadingLogin,
    isLoadingCreateTargetGroup,
    isLoadingUpdateUserSetting,
    isLoadingSubscribingTopics,
  ]);

  const connect = async () => {
    // NOTE: 2 steps connection process
    // Step#1.login & ensure target group.
    try {
      let frontendClient: NotifiFrontendClient | undefined = undefined;
      if (useHardwareWalletLogin) {
        frontendClient = await loginViaHardwareWallet();
      } else {
        frontendClient = await login();
      }

      if (!frontendClient) return;

      const isDefaultTargetExist = await validateDefaultTargetGroup(
        frontendClient,
      );

      if (!isDefaultTargetExist) {
        await renewTargetGroup();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  React.useEffect(() => {
    // Step#2: Subscribe topics (if FTU) or prompt to next view according to target group and ftu stage (After successful login: isAuthenticated === true)
    if (isLoadingUpdateUserSetting) return;
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
          afterConnected('ftu');
          break;
        case FtuStage.Done:
          afterConnected('Inbox');

          break;
        default: // ftuStage === null
          if (!isTopicsSubscriptionNotRequired) {
            await subscribeAlertsDefault(topicsToSubscribe, targetGroupId);
          }

          if (cardConfig?.isContactInfoRequired) {
            await updateFtuStage(FtuStage.Destination);
          } else {
            await updateFtuStage(FtuStage.Alerts);
          }
          break;
      }
    };
    subscribeAndUpdateFtuStage();
  }, [
    targetGroupId,
    ftuStage,
    frontendClientStatus,
    isLoadingUpdateUserSetting,
  ]);
  return {
    connect,
    isLoading,
    useHardwareWalletLogin,
    setUseHardwareWalletLogin,
  };
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
