import { useGlobalStateContext } from '@/context/GlobalStateContext';
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

type Target = 'email' | 'slack' | 'telegram' | 'discord';

export type NotifiSignUpButtonProps = Readonly<{
  buttonText: string;
  data: CardConfigItemV1;
  isEdit?: boolean;
  target?: Target;
}>;

type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
};

//todo implement in card context
const inputs = {};

export const NotifiSignUpButton: React.FC<NotifiSignUpButtonProps> = ({
  buttonText,
  data,
  isEdit,
  target,
}) => {
  const eventTypes = data.eventTypes;

  const frontendClientLogin = useFrontendClientLogin();

  const { handleRoute } = useRouterAsync();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
  } = useNotifiClientContext();

  const { loading, useDiscord, render, setLoading, syncFtuStage } =
    useNotifiSubscriptionContext();

  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();

  const {
    formErrorMessages,
    formState,
    setHasEmailChanges,
    setHasTelegramChanges,
  } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const {
    email: emailErrorMessage,
    phoneNumber: smsErrorMessage,
    telegram: telegramErrorMessage,
  } = formErrorMessages;

  const afterEditDestination = () => {
    switch (target) {
      case 'email':
        setHasEmailChanges(true);
        break;
      case 'telegram':
        setHasTelegramChanges(true);
        break;
      default:
        break;
    }
  };

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

  const renewTargetGroups = useCallback(
    async (targetGroup: TargetGroupData) => {
      return frontendClient.ensureTargetGroup(targetGroup);
    },
    [frontendClient, targetGroup],
  );

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
        console.log('targetGroup', targetGroup);
        const result = await renewTargetGroups(targetGroup);
        success = !!result;
      }

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
        await syncFtuStage(data.isContactInfoRequired);
        isEdit ? afterEditDestination() : handleRoute('/notifi/ftu');
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

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const isInputFieldsValid = useMemo(() => {
    return data.isContactInfoRequired
      ? email || phoneNumber || telegramId || useDiscord
      : true;
  }, [email, phoneNumber, telegramId, useDiscord, data.isContactInfoRequired]);

  const isSaveButtonDisabled = () => {
    switch (target) {
      case 'email':
        return !isInitialized || loading || emailErrorMessage !== '' || !email;
      case 'telegram':
        return (
          !isInitialized ||
          loading ||
          telegramErrorMessage !== '' ||
          !telegramId
        );
      default:
        return !isInitialized || loading || hasErrors || !isInputFieldsValid;
    }
  };
  return (
    <>
      {isEdit ? (
        <button
          className="rounded bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-16 h-7 mb-6 text-sm font-bold absolute top-2.5 right-6 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
          disabled={isSaveButtonDisabled()}
          onClick={onClick}
        >
          <span>{buttonText}</span>
        </button>
      ) : (
        <button
          className="rounded bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold"
          disabled={
            !isInitialized || loading || hasErrors || !isInputFieldsValid
          }
          onClick={onClick}
        >
          <span>{loading ? 'Loading' : buttonText}</span>
        </button>
      )}
    </>
  );
};
