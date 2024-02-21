import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { formatTelegramForSubscription } from '@/utils/stringUtils';
import {
  CardConfigItemV1,
  EventTypeConfig,
} from '@notifi-network/notifi-frontend-client';
import {
  createConfigurations,
  subscribeAlertsByFrontendClient,
  useFrontendClientLogin,
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscribe,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

export type NotifiSignUpButtonProps = Readonly<{
  buttonText: string;
  data: CardConfigItemV1;
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
}) => {
  const eventTypes = data.eventTypes;
  const { isInitialized, subscribe, updateTargetGroups } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const frontendClientLogin = useFrontendClientLogin();

  const router = useRouter();

  const { frontendClient } = useNotifiClientContext();

  const {
    connectedWallets,
    loading,
    setCardView,
    useDiscord,
    render,
    setLoading,
    syncFtuStage,
  } = useNotifiSubscriptionContext();

  const { setIsGlobalLoading } = useGlobalStateContext();

  const { formErrorMessages, formState } = useNotifiForm();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const { email: emailErrorMessage, phoneNumber: smsErrorMessage } =
    formErrorMessages;

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

  const renewTargetGroups = useCallback(async () => {
    return updateTargetGroups();
  }, [updateTargetGroups]);

  const subscribeAlerts = useCallback(
    async (eventTypes: EventTypeConfig, inputs: Record<string, unknown>) => {
      return subscribe(
        createConfigurations(eventTypes, inputs, connectedWallets),
      );
    },
    [
      targetGroup,
      frontendClient,
      connectedWallets,
      renewTargetGroups,
      subscribeAlertsByFrontendClient,
      subscribe,
      createConfigurations,
    ],
  );

  const onClick = useCallback(async () => {
    let isFirstTimeUser = false;
    if (frontendClient.userState?.status !== 'authenticated') {
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
        const result = await renewTargetGroups();
        success = !!result;
      }

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
        await syncFtuStage(data.isContactInfoRequired);
        router.push('/notifi/ftu');
      }
    } catch (e) {
      setCardView({ state: 'error', reason: e });
    }
    setIsGlobalLoading(false);
    setLoading(false);
  }, [
    frontendClient,
    eventTypes,
    frontendClientLogin,
    subscribe,
    updateTargetGroups,
    setCardView,
  ]);

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const isInputFieldsValid = useMemo(() => {
    return data.isContactInfoRequired
      ? email || phoneNumber || telegramId || useDiscord
      : true;
  }, [email, phoneNumber, telegramId, useDiscord, data.isContactInfoRequired]);

  return (
    <button
      className="rounded bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold"
      disabled={!isInitialized || loading || hasErrors || !isInputFieldsValid}
      onClick={onClick}
    >
      <span>{loading ? 'Loading' : buttonText}</span>
    </button>
  );
};
