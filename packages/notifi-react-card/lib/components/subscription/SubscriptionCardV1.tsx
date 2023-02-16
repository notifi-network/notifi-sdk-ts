import React, { useEffect, useRef } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import NotifiAlertBox from '../NotifiAlertBox';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { AlertListProps } from './subscription-card-views/AlertListPreview';
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
import VerifyWalletView from './subscription-card-views/VerifyWalletView';

export type SubscriptionCardV1Props = Readonly<{
  classNames?: {
    PreviewCard?: DeepPartialReadonly<PreviewCardProps['classNames']>;
    HistoryCard?: DeepPartialReadonly<AlertHistoryViewProps['classNames']>;
    EditCard?: DeepPartialReadonly<EditCardViewProps['classNames']>;
    AlertList?: DeepPartialReadonly<AlertListProps['classNames']>;
    ExpiredTokenView?: DeepPartialReadonly<
      ExpiredTokenViewCardProps['classNames']
    >;
  };
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, unknown>;
  inputLabels?: NotifiInputFieldsText;
  inputSeparators?: NotifiInputSeparators;
}>;

export const SubscriptionCardV1: React.FC<SubscriptionCardV1Props> = ({
  classNames,
  data,
  inputDisabled,
  inputs,
  inputLabels,
  inputSeparators,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];
  const { cardView, email, phoneNumber, telegramId, setCardView } =
    useNotifiSubscriptionContext();

  const { isInitialized, isTokenExpired } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  let view = null;

  const firstLoad = useRef(false);
  useEffect(() => {
    if (firstLoad.current || !isInitialized) {
      return;
    }

    firstLoad.current = true;

    if (
      (email !== '' && email !== undefined) ||
      (phoneNumber !== '' && phoneNumber !== undefined) ||
      (telegramId !== '' && telegramId !== undefined)
    ) {
      setCardView({ state: 'history' });
    } else if (isTokenExpired) {
      setCardView({ state: 'expired' });
    } else {
      setCardView({ state: 'signup' });
    }
  }, [email, phoneNumber, telegramId, setCardView, cardView, isInitialized]);

  switch (cardView.state) {
    case 'expired':
      view = <ExpiredTokenView classNames={classNames?.ExpiredTokenView} />;
      break;
    case 'preview':
      view = (
        <>
          <NotifiAlertBox
            leftIcon={{
              name: 'back',
              onClick: () => setCardView({ state: 'history' }),
            }}
          >
            <h2>Manage Alerts</h2>
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
            leftIcon={
              cardView.state === 'signup'
                ? undefined
                : {
                    name: 'back',
                    onClick: () => setCardView({ state: 'history' }),
                  }
            }
          ></NotifiAlertBox>
          <EditCardView
            buttonText={cardView.state === 'signup' ? 'Next' : 'Update'}
            data={data}
            classNames={classNames?.EditCard}
            inputDisabled={inputDisabled}
            inputTextFields={inputLabels}
            inputSeparators={inputSeparators}
            allowedCountryCodes={allowedCountryCodes}
            showPreview={cardView.state === 'signup'}
          />
        </>
      );
      break;
    case 'verifyonboarding':
    case 'verify':
      view = (
        <>
          <NotifiAlertBox
            leftIcon={{
              name: 'back',
              onClick: () =>
                setCardView({
                  state:
                    cardView.state === 'verifyonboarding' ? 'signup' : 'edit',
                }),
            }}
          >
            <h2>Verify Wallets</h2>
          </NotifiAlertBox>
          <VerifyWalletView
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
            rightIcon={{
              name: 'settings',
              onClick: () => setCardView({ state: 'preview' }),
            }}
          >
            <div>
              <h2>Alert History</h2>
            </div>
          </NotifiAlertBox>
          <AlertHistoryView />
        </>
      );
      break;
  }
  return <>{view}</>;
};
