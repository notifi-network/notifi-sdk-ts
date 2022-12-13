import clsx from 'clsx';
import {
  useNotifiClientContext,
  useNotifiForm,
} from 'notifi-react-card/lib/context';
import React, { useEffect, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context/NotifiSubscriptionContext';
import { useNotifiSubscribe } from '../../hooks';
import {
  IntercomCardConfigItemV1,
  LabelType,
} from '../../hooks/IntercomCardConfig';
import { chatConfiguration } from '../../utils/AlertConfiguration';
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
import { SettingHeader, SettingHeaderProps } from './SettingHeader';

export type IntercomCardProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    title?: string;
    subtitle1?: string;
    subtitle2?: string;
    NotifiStartChatButton?: NotifiStartChatButtonProps['classNames'];
    NotifiIntercomChatWindowContainer?: NotifiIntercomChatWindowContainerProps['classNames'];
    NotifiIntercomSettingHeader: SettingHeaderProps['classNames'];
    errorMessage: string;
  }>;
  inputLabels?: NotifiInputLabels;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
  data: IntercomCardConfigItemV1;
}>;

type LabelsMap = Record<LabelType, string | null>;

export const IntercomCard: React.FC<
  React.PropsWithChildren<IntercomCardProps>
> = ({
  classNames,
  inputLabels,
  inputs = {},
  inputSeparators,
  data,
}: React.PropsWithChildren<IntercomCardProps>) => {
  const [chatAlertErrorMessage, setChatAlertErrorMessage] =
    useState<string>('');
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Intercom',
  });
  const {
    alerts,
    loading,
    intercomCardView,
    setIntercomCardView,
    email,
    phoneNumber,
    smsErrorMessage,
    telegramId,
    telegramErrorMessage,
    setHasChatAlert,
    setConversationId,
    setUserId,
  } = useNotifiSubscriptionContext();

  const { formErrorMessages } = useNotifiForm();

  const { email: emailErrorMessage } = formErrorMessages;

  const { client } = useNotifiClientContext();
  const alertName = 'NOTIFI_CHAT_MESSAGES';
  useEffect(() => {
    if (
      loading ||
      !client.isInitialized ||
      intercomCardView.state === 'settingView'
    ) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setHasChatAlert(hasAlert);
    if (hasAlert) {
      client.createSupportConversation().then((result) => {
        result.participants.forEach((participant) => {
          if (participant.conversationParticipantType === 'MEMBER') {
            setUserId(participant.profile.id);
          }
        });
        setConversationId(result.id);
        setIntercomCardView({
          state: 'chatWindowView',
        });
      });
    } else {
      setIntercomCardView({
        state: 'startChatView',
      });
    }
  }, [alerts, loading, client.isInitialized]);

  const hasErrors =
    emailErrorMessage !== '' ||
    smsErrorMessage !== '' ||
    telegramErrorMessage !== '';
  const disabled =
    (email === '' && phoneNumber === '' && telegramId === '') || hasErrors;

  const labels = data.labels;
  const labelsValues = {} as LabelsMap;

  labels.forEach((label) => {
    labelsValues[label.type] = label.name;
  });
  const companySupportTitle =
    labelsValues.ChatFTUTitle || 'Your Company Support';
  const companySupportSubtitle =
    labelsValues.ChatFTUSubTitle ||
    'Start chatting with our team to get support. We’re here for you 24/7!';
  const companySupportDescription =
    labelsValues.ChatFTUDescription ||
    'Get notifications for your support request';
  const companyHeaderContent =
    labelsValues.ChatBannerTitle || 'Company Support';
  const chatIntroQuestion =
    labelsValues.ChatIntroQuestion || 'What can we help you with today?';

  const handleStartChatClick = async () => {
    if (loading) {
      return;
    }
    try {
      await instantSubscribe({
        alertConfiguration: chatConfiguration(),
        alertName: alertName,
      });
      const result = await client.createSupportConversation();
      setConversationId(result.id);
      result.participants.forEach((participant) => {
        if (participant.conversationParticipantType === 'MEMBER') {
          setUserId(participant.profile.id);
        }
      });

      setIntercomCardView({ state: 'chatWindowView' });
    } catch (e) {
      //TODO: use useErrorHandler hook instead of setTimeout to handle error messages
      setChatAlertErrorMessage('An error occurred, please try again.');
      setTimeout(() => {
        setChatAlertErrorMessage('');
      }, 5000);
    }
  };

  let view = null;

  switch (intercomCardView.state) {
    case 'startChatView':
      view = (
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
            data={data}
            inputs={inputs}
            inputLabels={inputLabels}
            inputSeparators={inputSeparators}
          />
          <label
            className={clsx(
              'NotifiEmailInput__errorMessage',
              classNames?.errorMessage,
            )}
          >
            {chatAlertErrorMessage}
          </label>
          <NotifiStartChatButton
            onClick={handleStartChatClick}
            disabled={disabled}
            classNames={classNames?.NotifiStartChatButton}
          />
        </>
      );
      break;
    case 'chatWindowView':
      view = (
        <NotifiIntercomChatWindowContainer
          chatWindowHeaderContent={companyHeaderContent}
          chatIntroQuestion={chatIntroQuestion}
          classNames={classNames?.NotifiIntercomChatWindowContainer}
        />
      );
      break;

    case 'settingView':
      view = (
        <>
          <SettingHeader classNames={classNames?.NotifiIntercomSettingHeader} />
          <div className={'NotifiIntercomCardSettingContent__container'}>
            <div
              className={clsx(
                'NotifiIntercomCard__subtitle2',
                classNames?.subtitle2,
              )}
            >
              {companySupportDescription}
            </div>
            <NotifiIntercomFTUNotificationTargetSection
              data={data}
              inputs={inputs}
              inputLabels={inputLabels}
              inputSeparators={inputSeparators}
            />
            <label
              className={clsx(
                'NotifiEmailInput__errorMessage',
                classNames?.errorMessage,
              )}
            >
              {chatAlertErrorMessage}
            </label>
            <NotifiStartChatButton
              onClick={handleStartChatClick}
              disabled={disabled}
              classNames={classNames?.NotifiStartChatButton}
            />
          </div>
        </>
      );
      break;
    case 'loadingView':
      view = <div>Loading&#8230;</div>;
      break;
  }
  return <>{view}</>;
};
