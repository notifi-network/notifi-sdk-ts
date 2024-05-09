import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTargetContext } from '@/context/NotifiTargetContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
  validateTopic,
} from '@notifi-network/notifi-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export type NotifiSignUpButtonProps = Readonly<{
  buttonText: string;
  data: CardConfigItemV1;
}>;

export const SignUpButton: React.FC<NotifiSignUpButtonProps> = ({
  buttonText,
  data,
}) => {
  const eventTypes = data.eventTypes;

  const { login } = useNotifiFrontendClientContext();
  const {
    ftuStage,
    updateFtuStage,
    isLoading: isLoadingFtu,
  } = useNotifiUserSettingContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    targetGroup,
    refreshTargetDocument,
    targetDocument: {
      targetData: { slack, discord },
      targetInputForm: { email, phoneNumber, telegram },
    },
  } = useNotifiTargetContext();

  const { handleRoute, isLoadingRouter } = useRouterAsync();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
  } = useNotifiFrontendClientContext();

  const { setGlobalError, setIsGlobalLoading } = useGlobalStateContext();

  const { subscribeFusionAlerts, isLoading: isSubscribingAlerts } =
    useNotifiTopicContext();

  const onClick = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      if (!ftuStage) {
        const subEvents = eventTypes.filter((event) => {
          return event.optOutAtSignup ? false : true;
        });
        await subscribeFusionAlerts(subEvents.filter(validateTopic));

        if (cardConfig?.isContactInfoRequired) {
          await updateFtuStage(FtuStage.Destination);
        } else {
          await updateFtuStage(FtuStage.Alerts);
        }
        const newData = await frontendClient.fetchData();
        refreshTargetDocument(newData);
        await handleRoute('/notifi/ftu');
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to signup, please try again.');
      console.error('Failed to singup', (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [frontendClient, eventTypes, login, setGlobalError, targetGroup]);

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
          slack.useSlack ||
          discord.useDiscord
      : true;
  }, [
    email,
    phoneNumber,
    telegram.value,
    discord.useDiscord,
    data.isContactInfoRequired,
    slack.useSlack,
  ]);

  return (
    <button
      className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
      disabled={!isInitialized || hasErrors || !isInputFieldsValid}
      onClick={onClick}
    >
      <span>{buttonText}</span>
    </button>
  );
};
