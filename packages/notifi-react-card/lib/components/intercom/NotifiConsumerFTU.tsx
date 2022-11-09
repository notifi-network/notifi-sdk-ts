import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import { CardConfigItemV1 } from 'notifi-react-card/lib/hooks';
import React, { useState } from 'react';

import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import {
  NotifiIntercomChatWindowContainer,
  NotifiIntercomChatWindowContainerProps,
} from './NotifiIntercomChatWindowContainer';
import { NotifiIntercomFTUNotificationTargetSection } from './NotifiIntercomFTUNotificationTargetSection';
import {
  NotifiStartChatButton,
  NotifiStartChatButtonProps,
} from './NotifiStartChatButton';

export type NotifiConsumerFTUProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    title?: string;
    subtitle1?: string;
    subtitle2?: string;
    NotifiStartChatButton?: NotifiStartChatButtonProps['classNames'];
    NotifiIntercomChatWindowContainer?: NotifiIntercomChatWindowContainerProps['classNames'];
  }>;
  companySupportTitle?: string;
  companySupportSubtitle?: string;
  companySupportDescription?: string;
  inputLabels?: NotifiInputLabels;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
  startChat: boolean;
  setStartChat: (startChat: boolean) => void;
  data: CardConfigItemV1;
}>;

export const NotifiConsumerFTU: React.FC<
  React.PropsWithChildren<NotifiConsumerFTUProps>
> = ({
  classNames,
  companySupportTitle,
  companySupportSubtitle,
  companySupportDescription,
  inputLabels,
  inputs = {},
  inputSeparators,
  startChat,
  setStartChat,
  data,
}: React.PropsWithChildren<NotifiConsumerFTUProps>) => {
  const [checked, setChecked] = useState<boolean>(true);
  const { email, emailErrorMessage, phoneNumber, smsErrorMessage, telegramId } =
    useNotifiSubscriptionContext();

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const disabled =
    (email === '' && phoneNumber === '' && telegramId === '' && !checked) ||
    hasErrors;

  companySupportTitle = companySupportTitle || 'Your Company Support';
  companySupportSubtitle =
    companySupportSubtitle ||
    'Start chatting with our team to get support. We’re here for you 24/7!';
  companySupportDescription =
    companySupportDescription || 'Get notifications for your support request';

  const handleStartChatClick = () => {
    setStartChat(true);
  };
  return (
    <>
      {startChat ? (
        <NotifiIntercomChatWindowContainer
          classNames={classNames?.NotifiIntercomChatWindowContainer}
        />
      ) : (
        <>
          <h1 className={clsx('NotifiIntercomCard__title', classNames?.title)}>
            {companySupportTitle}
          </h1>
          <div
            className={clsx(
              'NotifiIntercomCard__subtitle1',
              classNames?.subtitle1,
            )}
          >
            {companySupportSubtitle}
          </div>
          <div
            className={clsx(
              'NotifiIntercomCard__subtitle2',
              classNames?.subtitle2,
            )}
          >
            {companySupportDescription}
          </div>
          <NotifiIntercomFTUNotificationTargetSection
            checked={checked}
            setChecked={setChecked}
            data={data}
            inputs={inputs}
            inputLabels={inputLabels}
            inputSeparators={inputSeparators}
          />
          <NotifiStartChatButton
            onClick={handleStartChatClick}
            disabled={disabled}
            classNames={classNames?.NotifiStartChatButton}
          />
        </>
      )}
    </>
  );
};
