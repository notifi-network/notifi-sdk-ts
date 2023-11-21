import {
  CardConfigItemV2,
  TopicTypeItem,
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
import { subscribeAlertsByFrontendClient } from '../../../utils';
import { WalletList } from '../../WalletList';
import NotifiCardButton, {
  NotifiCardButtonProps,
} from '../../common/NotifiCardButton';

export type VerifyWalletViewV2Props = Readonly<{
  // TODO: MVP-3655
  classNames?: Readonly<{
    NotifiVerifyContainer?: string;
    NotifiInputHeading?: string;
    NotifiCardButtonProps?: NotifiCardButtonProps['classNames'];
  }>;
  buttonText: string;
  data: CardConfigItemV2;
  inputs: Record<string, unknown>;
}>;

const VerifyWalletViewV2: React.FC<VerifyWalletViewV2Props> = ({
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
  const { frontendClient } = useNotifiClientContext();

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
    async (eventTypes: TopicTypeItem[], inputs: Record<string, unknown>) => {
      await frontendClient.ensureTargetGroup(targetGroup);
      return subscribeAlertsByFrontendClient(
        frontendClient,
        eventTypes,
        inputs,
      );
    },
    [frontendClient, email, phoneNumber, telegramId, useDiscord],
  );
  const renewWallets = useCallback(
    async () => frontendClient.updateWallets(),
    [frontendClient],
  );

  const onClick = useCallback(async () => {
    if (cardView.state === 'verifyonboarding') {
      setLoading(true);

      try {
        const subEvents = data.topicTypes.filter((topic) => {
          return topic.optOutAtSignup ? false : true;
        });
        await subscribeAlerts(subEvents, inputs);
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
  }, [setLoading, data, inputs, connectedWallets, renewWallets]);

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

export default VerifyWalletViewV2;
