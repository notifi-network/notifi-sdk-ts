import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { TargetGroupData, useNotifiTargets } from '@/hooks/useNotifiTargets';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { formatTelegramForSubscription } from '@/utils/stringUtils';
import {
  CardConfigItemV1,
  EventTypeConfig,
} from '@notifi-network/notifi-frontend-client';
import {
  subscribeAlertsByFrontendClient,
  useFrontendClientLogin,
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useMemo } from 'react';

export type NotifiSignUpButtonProps = Readonly<{
  buttonText: string;
  data: CardConfigItemV1;
}>;

//todo implement in card context
const inputs = {};

export const NotifiSignUpButton: React.FC<NotifiSignUpButtonProps> = ({
  buttonText,
  data,
}) => {
  const eventTypes = data.eventTypes;

  const frontendClientLogin = useFrontendClientLogin();

  const { renewTargetGroups } = useNotifiTargets();

  const { handleRoute } = useRouterAsync();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
  } = useNotifiClientContext();

  const { loading, useDiscord, render, setLoading, syncFtuStage } =
    useNotifiSubscriptionContext();

  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const {
    email: emailErrorMessage,
    phoneNumber: smsErrorMessage,
    telegram: telegramErrorMessage,
  } = formErrorMessages;

  const targetGroup: TargetGroupData = useMemo(
    () => ({
      name: 'Default',
      emailAddress: email === '' ? undefined : email,
      phoneNumber: isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined,
      telegramId:
        telegramId === ''
          ? undefined
          : formatTelegramForSubscription(telegramId),
      discordId: useDiscord ? 'Default' : undefined,
    }),
    [email, phoneNumber, telegramId, useDiscord],
  );

  // TODO: migrate to useSubscribeAlert
  const subscribeAlerts = useCallback(
    async (eventTypes: EventTypeConfig, inputs: Record<string, unknown>) => {
      await renewTargetGroups(targetGroup);

      return subscribeAlertsByFrontendClient(
        frontendClient,
        eventTypes,
        inputs,
      );
    },
    [frontendClient, targetGroup],
  );
  const onClick = useCallback(async () => {
    let isFirstTimeUser = false;
    if (!isAuthenticated) {
      await frontendClientLogin();
      const data = await frontendClient.fetchData();
      isFirstTimeUser = (data.targetGroup?.length ?? 0) === 0;
    }
    setIsGlobalLoading(true);
    setLoading(true);
    try {
      let success = false;
      if (isFirstTimeUser) {
        const subEvents = eventTypes.filter((event) => {
          return event.optOutAtSignup ? false : true;
        });
        const result = await subscribeAlerts(subEvents, inputs);
        success = !!result;
      } else {
        const result = await renewTargetGroups(targetGroup);
        success = !!result;
      }

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
        await syncFtuStage(data.isContactInfoRequired);
        handleRoute('/notifi/ftu');
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to signup, check console for more details');
      console.error('Failed to singup', (e as Error).message);
    }
    setIsGlobalLoading(false);
    setLoading(false);
  }, [
    frontendClient,
    eventTypes,
    frontendClientLogin,
    setGlobalError,
    targetGroup,
  ]);

  const hasErrors =
    emailErrorMessage !== '' ||
    smsErrorMessage !== '' ||
    telegramErrorMessage !== '';
  const isInputFieldsValid = useMemo(() => {
    return data.isContactInfoRequired
      ? email || phoneNumber || telegramId || useDiscord
      : true;
  }, [email, phoneNumber, telegramId, useDiscord, data.isContactInfoRequired]);

  return (
    <button
      className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
      disabled={!isInitialized || loading || hasErrors || !isInputFieldsValid}
      onClick={onClick}
    >
      <span>{loading ? 'Loading' : buttonText}</span>
    </button>
  );
};
