import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context/NotifiSubscriptionContext';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
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
  companySupportTitle?: string;
  companySupportSubtitle?: string;
  companySupportDescription?: string;
  inputLabels?: NotifiInputLabels;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
  data: CardConfigItemV1;
}>;

export const IntercomCard: React.FC<
  React.PropsWithChildren<IntercomCardProps>
> = ({
  classNames,
  companySupportTitle,
  companySupportSubtitle,
  companySupportDescription,
  inputLabels,
  inputs = {},
  inputSeparators,
  data,
}: React.PropsWithChildren<IntercomCardProps>) => {
  const [hasChatAlert, setHasChatAlert] = useState<boolean>(false);
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
    emailErrorMessage,
    phoneNumber,
    smsErrorMessage,
    telegramId,
    telegramErrorMessage,
  } = useNotifiSubscriptionContext();

  const alertName = 'NOTIFI_CHAT_MESSAGES';

  useEffect(() => {
    if (loading) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setHasChatAlert(hasAlert);
  }, [loading, alerts]);

  const hasErrors =
    emailErrorMessage !== '' ||
    smsErrorMessage !== '' ||
    telegramErrorMessage !== '';
  const disabled =
    (email === '' && phoneNumber === '' && telegramId === '') || hasErrors;

  companySupportTitle = companySupportTitle || 'Your Company Support';
  companySupportSubtitle =
    companySupportSubtitle ||
    'Start chatting with our team to get support. We’re here for you 24/7!';
  companySupportDescription =
    companySupportDescription || 'Get notifications for your support request';

  const handleStartChatClick = () => {
    if (loading) {
      return;
    }
    try {
      instantSubscribe({
        alertConfiguration: chatConfiguration(),
        alertName: alertName,
      });

      setIntercomCardView({ state: 'chatWindowView' });
    } catch (e) {
      setChatAlertErrorMessage('Error to subscribe, please try again');
      //TODO: use useErrorHandler hook instead of setTimeout to handle error messages
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
            hasChatAlert={hasChatAlert}
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
            hasChatAlert={hasChatAlert}
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
              hasChatAlert={hasChatAlert}
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
              hasChatAlert={hasChatAlert}
              onClick={handleStartChatClick}
              disabled={disabled}
              classNames={classNames?.NotifiStartChatButton}
            />
          </div>
        </>
      );
      break;
  }
  return <>{view}</>;
};
