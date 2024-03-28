import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useNotifiTargetContext } from '@/context/NotifiTargetContext';
import {
  useNotifiTopicContext,
  validateTopic,
} from '@/context/NotifiTopicContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React, { useCallback, useMemo } from 'react';

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
    renewTargetGroups,
    targetGroup,
    refreshTargetDocument,
    targetDocument: {
      targetData: { slack, discord },
      targetInputForm: { email, phoneNumber, telegram },
    },
  } = useNotifiTargetContext();

  const { handleRoute } = useRouterAsync();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
  } = useNotifiFrontendClientContext();

  const { setGlobalError } = useGlobalStateContext();

  const { subscribeFusionAlerts } = useNotifiTopicContext();

  const onClick = useCallback(async () => {
    let isFirstTimeUser = false;
    if (!isAuthenticated) {
      await login();
      const data = await frontendClient.fetchData();
      isFirstTimeUser = (data.targetGroup?.length ?? 0) === 0;
    }
    try {
      let success = false;
      if (isFirstTimeUser) {
        const subEvents = eventTypes.filter((event) => {
          return event.optOutAtSignup ? false : true;
        });
        const result = await subscribeFusionAlerts(
          subEvents.filter(validateTopic),
        );
        success = !!result;
      } else {
        const result = await renewTargetGroups(targetGroup);
        success = !!result;
      }

      if (success) {
        const newData = await frontendClient.fetchData();
        refreshTargetDocument(newData);
        handleRoute('/notifi/ftu');
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to signup, please try again.');
      console.error('Failed to singup', (e as Error).message);
    }
  }, [frontendClient, eventTypes, login, setGlobalError, targetGroup]);

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
