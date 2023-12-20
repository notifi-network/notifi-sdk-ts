import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { useDestinationState } from 'notifi-react-card/lib/hooks/useDestinationState';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  FtuStage,
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
import { ConfigAlertModal, ConfigAlertModalProps } from '../ConfigAlertModal';
import {
  ConfigDestinationModal,
  ConfigDestinationModalProps,
} from '../ConfigDestinationModal';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../NotifiAlertBox';
import { SignupBanner, SignupBannerProps } from '../SignupBanner';
import { ErrorStateCard, LoadingStateCard } from '../common';
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
  NotificationHistoryEntry,
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
    AlertHistory: AlertHistoryViewProps['copy'];
    expiredHeader: string;
    manageAlertsHeader: string;
    signUpHeader: string;
    editHeader: string;
    verifyWalletsHeader: string;
    historyHeader: string;
    detailHeader: string;
  }>;
  classNames?: DeepPartialReadonly<{
    AlertHistoryView: AlertHistoryViewProps['classNames'];
    AlertDetailsCard: AlertDetailsProps['classNames'];
    PreviewCard: PreviewCardProps['classNames'];
    HistoryCard?: AlertHistoryViewProps['classNames'];
    EditCard: EditCardViewProps['classNames'];
    ExpiredTokenView: ExpiredTokenViewCardProps['classNames'];
    VerifyWalletView: VerifyWalletViewProps['classNames'];
    // TODO: deprecate after all refactor ( /* Deprecated: use NotifiAlertBox in each cardView */)
    NotifiAlertBox: NotifiAlertBoxProps['classNames'];
    ErrorStateCard: string;
    ConfigDestinationModal: ConfigDestinationModalProps['classNames'];
    // TODO: deprecate after all refactor ( /* Deprecated: use NotifiAlertBox in each cardView */)
    signupBanner: SignupBannerProps['classNames'];
    ConfigAlertModal: ConfigAlertModalProps['classNames'];
    // TODO: deprecate after all refactor ( /* Deprecated: use NotifiAlertBox in each cardView */)
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
    ftuStage,
    syncFtuStage,
    updateFtuStage,
    loading,
    setLoading,
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

  const { isAuthenticated, isTokenExpired } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const { isClientTokenExpired, isClientAuthenticated } = useMemo(() => {
    let isClientTokenExpired = false;
    let isClientAuthenticated = false;
    if (isUsingFrontendClient) {
      isClientTokenExpired = frontendClient.userState?.status === 'expired';
      isClientAuthenticated =
        frontendClient.userState?.status === 'authenticated';
    } else {
      isClientTokenExpired = isTokenExpired;
      isClientAuthenticated = isAuthenticated;
    }
    return { isClientTokenExpired, isClientAuthenticated };
  }, [
    frontendClient.userState?.status,
    isTokenExpired,
    isAuthenticated,
    isUsingFrontendClient,
  ]);

  const { isTargetsExist } = useDestinationState();

  const [selectedAlertEntry, setAlertEntry] = useState<
    NotificationHistoryEntry | undefined
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
    setCardView(() => {
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
      setLoading(true);
      syncFtuStage(data.isContactInfoRequired)
        .catch((e) => {
          console.log(`Failed to syncFtuStage: ${e}`);
        })
        .finally(() => setLoading(false));

      if (isClientTokenExpired) {
        return { state: 'expired' };
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
          <div
            className={clsx('DividerLine expired', classNames?.dividerLine)}
          />
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
          <div
            className={clsx('DividerLine preview', classNames?.dividerLine)}
          />

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
          <div
            className={clsx('DividerLine signup', classNames?.dividerLine)}
          />
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
          <div
            className={clsx('DividerLine verify', classNames?.dividerLine)}
          />
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
        <AlertHistoryView
          classNames={classNames?.AlertHistoryView}
          copy={copy?.AlertHistory}
          setAlertEntry={setAlertEntry}
          data={data}
          headerRightIcon={rightIcon}
        />
      );
      break;

    case 'historyDetail':
      view = selectedAlertEntry ? (
        <AlertDetailsCard
          headerTitle={
            (data?.titles?.active && data?.titles.alertDetailsView) ||
            'Alert Details'
          }
          notificationEntry={selectedAlertEntry}
          classNames={classNames?.AlertDetailsCard}
          headerRightIcon={rightIcon}
        />
      ) : (
        setCardView({ state: 'history' })
      );
      break;
    case 'error':
      view = <ErrorStateCard reason={cardView.reason as string} />;
      break;
    default:
      view = <div>Not supported view</div>;
  }

  if (loading) {
    return <LoadingStateCard />;
  }

  return (
    <>
      {ftuStage === FtuStage.Alerts ? (
        <ConfigAlertModal
          classNames={classNames?.ConfigAlertModal}
          updateFtuStage={updateFtuStage}
          data={data}
          inputDisabled={inputDisabled}
          inputs={inputs}
        />
      ) : null}
      {ftuStage === FtuStage.Destination ? (
        <ConfigDestinationModal
          classNames={classNames?.ConfigDestinationModal}
          updateFtuStage={updateFtuStage}
          contactInfo={data.contactInfo}
        />
      ) : null}
      {view}
    </>
  );
};
