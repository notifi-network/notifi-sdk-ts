import {
  CardConfigItemV1,
  EventTypeConfig,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { formatTelegramForSubscription } from 'notifi-react-card/lib/utils/stringUtils';
import React, { useCallback, useMemo } from 'react';

import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../../context';
import { useNotifiSubscribe } from '../../../hooks';
import {
  createConfigurations,
  subscribeAlertsByFrontendClient,
} from '../../../utils';
import { WalletList } from '../../WalletList';
import NotifiCardButton, {
  NotifiCardButtonProps,
} from '../../common/NotifiCardButton';

export type VerifyWalletViewProps = Readonly<{
  classNames?: Readonly<{
    NotifiVerifyContainer?: string;
    NotifiInputHeading?: string;
    NotifiCardButtonProps?: NotifiCardButtonProps['classNames'];
  }>;
  buttonText: string;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
}>;

const VerifyWalletView: React.FC<VerifyWalletViewProps> = ({
  classNames,
  buttonText,
  data,
  inputs,
}) => {
  const {
    cardView,
    setCardView,
    loading,
    setLoading,
    connectedWallets,
    useDiscord,
  } = useNotifiSubscriptionContext();

  const {
    formState: { phoneNumber, telegram: telegramId, email },
  } = useNotifiForm();

  const { subscribe, updateWallets } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const targetGroup = useMemo(
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

  const subscribeAlerts = useCallback(
    async (eventTypes: EventTypeConfig, inputs: Record<string, unknown>) => {
      if (isUsingFrontendClient) {
        await frontendClient.ensureTargetGroup(targetGroup);
        return subscribeAlertsByFrontendClient(
          frontendClient,
          eventTypes,
          inputs,
        );
      }
      return subscribe(
        createConfigurations(data.eventTypes, inputs, connectedWallets),
      );
    },
    [
      isUsingFrontendClient,
      frontendClient,
      email,
      phoneNumber,
      telegramId,
      useDiscord,
      subscribe,
    ],
  );
  const renewWallets = useCallback(async () => {
    if (isUsingFrontendClient) {
      return frontendClient.updateWallets();
    }
    return updateWallets();
  }, [isUsingFrontendClient, frontendClient, updateWallets]);

  const onClick = useCallback(async () => {
    if (cardView.state === 'verifyonboarding') {
      setLoading(true);

      try {
        await subscribeAlerts(data.eventTypes, inputs);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);

      try {
        await renewWallets();
      } finally {
        setLoading(false);
      }
    }
    setCardView({ state: 'preview' });
  }, [setLoading, data, inputs, connectedWallets, subscribe, renewWallets]);

  return (
    <div
      className={clsx(
        'NotifiVerifyContainer',
        classNames?.NotifiVerifyContainer,
      )}
    >
      <WalletList />
      <NotifiCardButton
        buttonText={buttonText}
        disabled={loading}
        onClick={onClick}
      />
    </div>
  );
};

export default VerifyWalletView;
