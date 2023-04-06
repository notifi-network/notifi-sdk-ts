import { NotificationHistoryEntry } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNotifiDemoPreviewContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import {
  AlertDetailsCard,
  AlertDetailsProps,
} from '../AlertHistory/AlertDetailsCard';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../NotifiAlertBox';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import {
  EditCardView,
  EditCardViewProps,
} from './subscription-card-views/EditCardView';
import {
  ExpiredTokenView,
  ExpiredTokenViewCardProps,
} from './subscription-card-views/ExpiredTokenViewCard';
import {
  AlertHistoryView,
  AlertHistoryViewProps,
} from './subscription-card-views/HistoryCardView';
import {
  PreviewCard,
  PreviewCardProps,
} from './subscription-card-views/PreviewCard';
import VerifyWalletView, {
  VerifyWalletViewProps,
} from './subscription-card-views/VerifyWalletView';

export type SubscriptionCardV1Props = Readonly<{
  copy?: DeepPartialReadonly<{
    EditCard: EditCardViewProps['copy'];
    expiredHeader: string;
    manageAlertsHeader: string;
    signUpHeader: string;
    editHeader: string;
    verifyWalletsHeader: string;
    historyHeader: string;
    detailHeader: string;
  }>;
  classNames?: DeepPartialReadonly<{
    alertContainer: string;
    AlertHistoryView: AlertHistoryViewProps['classNames'];
    AlertDetailsCard: AlertDetailsProps['classNames'];
    PreviewCard: PreviewCardProps['classNames'];
    HistoryCard?: AlertHistoryViewProps['classNames'];
    EditCard: EditCardViewProps['classNames'];
    ExpiredTokenView: ExpiredTokenViewCardProps['classNames'];
    VerifyWalletView: VerifyWalletViewProps['classNames'];
    NotifiAlertBox: NotifiAlertBoxProps['classNames'];
  }>;
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
  inputLabels?: NotifiInputFieldsText;
  inputSeparators?: NotifiInputSeparators;
  onClose?: () => void;
}>;

export const SubscriptionCardV1: React.FC<SubscriptionCardV1Props> = ({
  classNames,
  copy,
  data,
  inputDisabled,
  inputs,
  inputLabels,
  inputSeparators,
  onClose,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];
  const {
    cardView,
    email,
    phoneNumber,
    telegramId,
    setCardView,
    discordTargetData,
  } = useNotifiSubscriptionContext();
  const { demoPreview } = useNotifiDemoPreviewContext();

  const {
    setEmail,
    setTelegram,
    setPhoneNumber,
    setEmailErrorMessage,
    setTelegramErrorMessage,
    setPhoneNumberErrorMessage,
  } = useNotifiForm();

  const { isInitialized, isTokenExpired } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const [selectedAlertEntry, setAlertEntry] = useState<
    NotificationHistoryEntry | undefined
  >(undefined);

  let view = null;

  const firstLoad = useRef(false);

  const resetFormState = useCallback(() => {
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setTelegram(telegramId);
    setEmailErrorMessage('');
    setTelegramErrorMessage('');
    setPhoneNumberErrorMessage('');
  }, [email, phoneNumber, telegramId]);

  useEffect(() => {
    if (demoPreview) {
      return setCardView({ state: demoPreview.view });
    }
    if (firstLoad.current || !isInitialized) {
      return;
    }

    firstLoad.current = true;

    if (
      (email !== '' && email !== undefined) ||
      (phoneNumber !== '' && phoneNumber !== undefined) ||
      (telegramId !== '' && telegramId !== undefined) ||
      (discordTargetData?.id !== '' &&
        discordTargetData?.discordAccountId !== undefined)
    ) {
      setCardView({ state: 'history' });
    } else if (isTokenExpired) {
      setCardView({ state: 'expired' });
    } else {
      setCardView({ state: 'signup' });
    }
  }, [
    email,
    phoneNumber,
    telegramId,
    setCardView,
    cardView.state,
    isInitialized,
    demoPreview,
  ]);

  const rightIcon: NotifiAlertBoxButtonProps | undefined = useMemo(() => {
    if (onClose === undefined) {
      return undefined;
    }

    return {
      name: 'close',
      onClick: onClose,
    };
  }, [onClose]);

  const useCustomTitles = data?.titles?.active === true;

  const expiredHeader = () => {
    return useCustomTitles && data?.titles.expiredView !== ''
      ? data?.titles.expiredView
      : copy?.expiredHeader ?? 'Welcome Back';
  };

  const previewHeader = () => {
    return useCustomTitles && data?.titles.previewView !== ''
      ? data?.titles.previewView
      : copy?.manageAlertsHeader ?? 'Manage Alerts';
  };

  const signUpHeader = () => {
    return useCustomTitles && data?.titles.signupView !== ''
      ? data?.titles.signupView
      : copy?.signUpHeader ?? 'Get Notified';
  };
  const editHeader = () => {
    return useCustomTitles && data?.titles.editView !== ''
      ? data?.titles.editView
      : copy?.editHeader ?? 'Update Settings';
  };
  const verifyOnboardingHeader = () => {
    return useCustomTitles && data?.titles.verifyWalletsView !== ''
      ? data?.titles.verifyWalletsView
      : copy?.verifyWalletsHeader ?? 'Verify Wallets';
  };

  const historyView = () => {
    return selectedAlertEntry === undefined
      ? useCustomTitles && data?.titles.alertDetailsView !== ''
        ? data?.titles.alertDetailsView
        : copy?.historyHeader ?? 'Alert History'
      : copy?.detailHeader ?? 'Alert Details';
  };

  switch (cardView.state) {
    case 'expired':
      view = (
        <>
          <NotifiAlertBox
            classNames={classNames?.NotifiAlertBox}
            rightIcon={rightIcon}
          >
            <h2>{expiredHeader()}</h2>
          </NotifiAlertBox>
          <ExpiredTokenView classNames={classNames?.ExpiredTokenView} />
        </>
      );
      break;
    case 'preview':
      view = (
        <>
          <NotifiAlertBox
            classNames={classNames?.NotifiAlertBox}
            leftIcon={{
              name: 'back',
              onClick: () => setCardView({ state: 'history' }),
            }}
            rightIcon={rightIcon}
          >
            <h2>{previewHeader()}</h2>
          </NotifiAlertBox>
          <PreviewCard
            data={data}
            inputs={inputs}
            inputDisabled={inputDisabled}
            classNames={classNames?.PreviewCard}
          />
        </>
      );
      break;
    case 'edit':
    case 'signup':
      view = (
        <>
          <NotifiAlertBox
            classNames={classNames?.NotifiAlertBox}
            leftIcon={
              cardView.state === 'signup'
                ? undefined
                : {
                    name: 'back',
                    onClick: () => {
                      resetFormState();
                      setCardView({ state: 'preview' });
                    },
                  }
            }
            rightIcon={rightIcon}
          >
            {cardView.state === 'signup' ? (
              <h2>{signUpHeader()}</h2>
            ) : (
              <h2>{editHeader()}</h2>
            )}
          </NotifiAlertBox>
          <EditCardView
            buttonText={cardView.state === 'signup' ? 'Next' : 'Update'}
            data={data}
            copy={copy?.EditCard}
            classNames={classNames?.EditCard}
            inputDisabled={inputDisabled}
            inputTextFields={inputLabels}
            inputSeparators={inputSeparators}
            allowedCountryCodes={allowedCountryCodes}
            showPreview={cardView.state === 'signup'}
            inputs={inputs}
          />
        </>
      );
      break;
    case 'verifyonboarding':
    case 'verify':
      view = (
        <>
          <NotifiAlertBox
            classNames={classNames?.NotifiAlertBox}
            leftIcon={{
              name: 'back',
              onClick: () =>
                setCardView({
                  state:
                    cardView.state === 'verifyonboarding'
                      ? 'signup'
                      : 'preview',
                }),
            }}
            rightIcon={rightIcon}
          >
            <h2>{verifyOnboardingHeader()}</h2>
          </NotifiAlertBox>
          <VerifyWalletView
            classNames={classNames?.VerifyWalletView}
            data={data}
            inputs={inputs}
            buttonText={
              cardView.state === 'verifyonboarding' ? 'Next' : 'Confirm'
            }
          />
        </>
      );
      break;
    case 'history':
      view = (
        <>
          <NotifiAlertBox
            classNames={classNames?.NotifiAlertBox}
            leftIcon={
              selectedAlertEntry === undefined
                ? {
                    name: 'settings',
                    onClick: () => setCardView({ state: 'preview' }),
                  }
                : {
                    name: 'back',
                    onClick: () => setAlertEntry(undefined),
                  }
            }
            rightIcon={rightIcon}
          >
            <h2>{historyView()}</h2>
          </NotifiAlertBox>
          <div
            className={clsx(
              'NotifiSubscriptionCardV1__alertContainer',
              classNames?.alertContainer,
            )}
          >
            {selectedAlertEntry === undefined ? null : (
              <AlertDetailsCard
                notificationEntry={selectedAlertEntry}
                classNames={classNames?.AlertDetailsCard}
              />
            )}
            <AlertHistoryView
              classNames={classNames?.AlertHistoryView}
              isHidden={selectedAlertEntry !== undefined}
              setAlertEntry={setAlertEntry}
            />
          </div>
        </>
      );
      break;
    default:
      view = <div>Not supported view</div>;
  }
  return <>{view}</>;
};
