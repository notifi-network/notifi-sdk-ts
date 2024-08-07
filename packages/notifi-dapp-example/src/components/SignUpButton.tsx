import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export type NotifiSignUpButtonProps = Readonly<{
  buttonText: string;
  data: CardConfigItemV1;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}>;

export const SignUpButton: React.FC<NotifiSignUpButtonProps> = ({
  buttonText,
  data,
  isLoading,
  setIsLoading,
}) => {
  const eventTypes = data.eventTypes;

  const { login } = useNotifiFrontendClientContext();
  const {
    ftuStage,
    updateFtuStage,
    isLoading: isLoadingFtu,
  } = useNotifiUserSettingContext();
  const { cardConfig, fusionEventTopics } = useNotifiTenantConfigContext();

  const {
    renewTargetGroup,
    targetDocument: {
      targetInputs: { email, phoneNumber, telegram, slack, discord, wallet },
    },
  } = useNotifiTargetContext();

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
    setIsLoading(true);
    await renewTargetGroup();
    const targetGroups = await frontendClient.getTargetGroups();
    const targetGroupId = targetGroups.find(
      (targetGroup) => targetGroup.name === 'Default',
    )?.id;
    if (!targetGroupId) {
      setGlobalError('ERROR: Failed to get target group ID');
      setIsLoading(false);
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
        setIsLoading(false);
      }
    });
  }, [
    frontendClient,
    eventTypes,
    login,
    setGlobalError,
    renewTargetGroup,
    discord,
    wallet,
  ]);

  useEffect(() => {
    if (
      !isLoadingRouter &&
      !isLoading &&
      !isLoadingFtu &&
      !isSubscribingAlerts
    ) {
      setIsGlobalLoading(false);
      return;
    }
    setIsGlobalLoading(true);
  }, [isLoadingRouter, isLoading, isLoadingFtu, isSubscribingAlerts]);

  const hasErrors = !!email.error || !!phoneNumber.error || !!telegram.error;
  const isInputFieldsValid = useMemo(() => {
    return data.isContactInfoRequired
      ? !!email.value ||
          !!phoneNumber.value ||
          !!telegram.value ||
          slack ||
          discord ||
          wallet
      : true;
  }, [
    email,
    phoneNumber,
    telegram.value,
    discord,
    data.isContactInfoRequired,
    slack,
    wallet,
  ]);

  return (
    <button
      className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-9 text-sm font-bold disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
      disabled={!isInitialized || hasErrors || !isInputFieldsValid}
      onClick={onClick}
    >
      <span>{buttonText}</span>
    </button>
  );
};
