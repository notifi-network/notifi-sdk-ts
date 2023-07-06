import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNotifiClientContext,
  useNotifiDemoPreviewContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '../../context';
import { useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import {
  AlertDetailsCard,
  AlertDetailsProps,
} from '../AlertHistory/AlertDetailsCard';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../NotifiAlertBox';
import { SignupBanner, SignupBannerProps } from '../SignupBanner';
import { ErrorStateCard } from '../common';
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
    ErrorStateCard: string;
    signupBanner: SignupBannerProps['classNames'];
    dividerLine: string;
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

  const { isInitialized, isTokenExpired, isAuthenticated } = useNotifiSubscribe(
    {
      targetGroupName: 'Default',
    },
  );

  const {
    canary: { isActive: canaryIsActive, frontendClient },
  } = useNotifiClientContext();

  const firstLoad = useRef(false);

  const { isClientInitialized, isClientTokenExpired, isClientAuthenticated } =
    useMemo(() => {
      let isClientInitialized = false;
      let isClientTokenExpired = false;
      let isClientAuthenticated = false;
      if (canaryIsActive) {
        isClientInitialized = !!frontendClient.userState;
        isClientTokenExpired = frontendClient.userState?.status === 'expired';
        isClientAuthenticated =
          frontendClient.userState?.status === 'authenticated';
      } else {
        isClientInitialized = isInitialized;
        isClientTokenExpired = isTokenExpired;
        isClientAuthenticated = isAuthenticated;
      }
      return {
        isClientInitialized,
        isClientTokenExpired,
        isClientAuthenticated,
      };
    }, [
      frontendClient.userState?.status,
      isTokenExpired,
      isInitialized,
      isAuthenticated,
      canaryIsActive,
    ]);

  const isTargetsExist = useMemo(() => {
    return (
      !!email ||
      !!phoneNumber ||
      !!telegramId ||
      (!!discordTargetData?.id && !!discordTargetData?.discordAccountId)
    );
  }, [
    email,
    phoneNumber,
    telegramId,
    discordTargetData?.id,
    discordTargetData?.discordAccountId,
  ]);
  const [selectedAlertEntry, setAlertEntry] = useState<
    Types.NotificationHistoryEntryFragmentFragment | undefined
  >(undefined);

  let view = null;

  const resetFormState = useCallback(() => {
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setTelegram(telegramId);
    setEmailErrorMessage('');
    setTelegramErrorMessage('');
    setPhoneNumberErrorMessage('');
  }, [email, phoneNumber, telegramId]);

  useEffect(() => {
    setCardView((prev) => {
      if (demoPreview) {
        return {
          state: demoPreview.view,
          reason:
            demoPreview.view === 'error' ? 'test example reason' : undefined,
        };
      }

      if (!isClientAuthenticated) {
        return { state: 'signup' };
      }

      if (isClientTokenExpired) {
        return { state: 'expired' };
      }

      if (prev.state === 'signup') {
        return { state: 'preview' };
      }

      return { state: 'history' };
    });
  }, []);

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
    if (!useCustomTitles) {
      return selectedAlertEntry ? 'Alert Details' : 'Alert History';
    }

    return selectedAlertEntry
      ? data?.titles.alertDetailsView || 'Alert Details'
      : data?.titles.historyView || 'Alert History';
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
          <div className={clsx('DividerLine', classNames?.dividerLine)} />
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
          {!isTargetsExist ? (
            <SignupBanner data={data} classNames={classNames?.signupBanner} />
          ) : null}
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
          <div className={clsx('DividerLine', classNames?.dividerLine)} />
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
          <div className={clsx('DividerLine', classNames?.dividerLine)} />
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
            <div className={clsx('DividerLine', classNames?.dividerLine)} />
            {!isTargetsExist ? (
              <SignupBanner data={data} classNames={classNames?.signupBanner} />
            ) : null}
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
              data={data}
            />
          </div>
        </>
      );
      break;
    case 'error':
      view = <ErrorStateCard reason={cardView.reason as string} />;
      break;
    default:
      view = <div>Not supported view</div>;
  }
  return <>{view}</>;
};
