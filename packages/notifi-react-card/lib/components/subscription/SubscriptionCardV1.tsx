import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React, { useEffect, useMemo, useState } from 'react';

import {
  FtuStage,
  useNotifiClientContext,
  useNotifiDemoPreviewContext,
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
import { NotifiAlertBoxButtonProps } from '../NotifiAlertBox';
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
    PreviewCard: PreviewCardProps['copy'];
    expiredHeader: string;
    ExpiredTokenView: ExpiredTokenViewCardProps['copy'];
    verifyWalletsHeader: string;
    historyHeader: string;
    detailHeader: string;
    signUpHeader: string;
    editHeader: string;
  }>;
  classNames?: DeepPartialReadonly<{
    AlertHistoryView: AlertHistoryViewProps['classNames'];
    AlertDetailsCard: AlertDetailsProps['classNames'];
    PreviewCard: PreviewCardProps['classNames'];
    HistoryCard?: AlertHistoryViewProps['classNames'];
    EditCard: EditCardViewProps['classNames'];
    ExpiredTokenView: ExpiredTokenViewCardProps['classNames'];
    VerifyWalletView: VerifyWalletViewProps['classNames'];
    ErrorStateCard: string;
    ConfigDestinationModal: ConfigDestinationModalProps['classNames'];
    ConfigAlertModal: ConfigAlertModalProps['classNames'];
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
    setCardView,
    ftuStage,
    syncFtuStage,
    updateFtuStage,
    loading,
    setLoading,
  } = useNotifiSubscriptionContext();
  const { demoPreview } = useNotifiDemoPreviewContext();

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

  const [selectedAlertEntry, setAlertEntry] = useState<
    NotificationHistoryEntry | undefined
  >(undefined);

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

  let view = null;
  switch (cardView.state) {
    case 'expired':
      view = (
        <>
          <ExpiredTokenView
            classNames={classNames?.ExpiredTokenView}
            headerRightIcon={rightIcon}
            headerTitle={
              (data?.titles?.active && data?.titles.expiredView) ||
              'Welcome Back'
            }
            copy={copy?.ExpiredTokenView}
          />
        </>
      );
      break;
    case 'preview':
      view = (
        <PreviewCard
          data={data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          classNames={classNames?.PreviewCard}
          copy={copy?.PreviewCard}
          headerRightIcon={rightIcon}
        />
      );
      break;
    case 'edit':
    case 'signup':
      view = (
        <EditCardView
          data={data}
          copy={copy?.EditCard}
          classNames={classNames?.EditCard}
          inputDisabled={inputDisabled}
          inputTextFields={inputLabels}
          inputSeparators={inputSeparators}
          allowedCountryCodes={allowedCountryCodes}
          inputs={inputs}
          headerRightIcon={rightIcon}
          viewState={cardView.state}
        />
      );
      break;
    case 'verifyonboarding':
    case 'verify':
      view = (
        <VerifyWalletView
          classNames={classNames?.VerifyWalletView}
          data={data}
          inputs={inputs}
          headerRightIcon={rightIcon}
          viewState={cardView.state}
        />
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
