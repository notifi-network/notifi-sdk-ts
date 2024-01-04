import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { useNotifiForm } from 'notifi-react-card/lib/context';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { useNotifiSubscriptionContext } from '../../../context/NotifiSubscriptionContext';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../../NotifiAlertBox';
import Spinner from '../../common/Spinner';
import {
  NotifiSubscribeButton,
  NotifiSubscribeButtonProps,
} from '../NotifiSubscribeButton';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from '../NotifiSubscriptionCard';
import { AlertListPreview, AlertListPreviewProps } from './AlertListPreview';
import { InputFields, InputFieldsProps } from './InputFields';

export type EditCardViewProps = Readonly<{
  data: CardConfigItemV1;
  inputDisabled: boolean;
  showPreview?: boolean;
  copy?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['copy'];
    buttonText?: {
      signup?: string;
      edit?: string;
    };
  }>;
  classNames?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['classNames'];
    NotifiInputContainer?: string;
    InputFields?: DeepPartialReadonly<InputFieldsProps['classNames']>;
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiInputHeading?: string;
    dividerLine?: string;
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
  }>;
  inputSeparators?: NotifiInputSeparators;
  inputTextFields?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
  inputs: Record<string, unknown>;
  headerRightIcon?: NotifiAlertBoxButtonProps;
  viewState: 'edit' | 'signup';
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  allowedCountryCodes,
  copy,
  classNames,
  showPreview,
  data,
  inputDisabled,
  inputSeparators,
  inputTextFields,
  inputs,
  headerRightIcon,
  viewState,
}) => {
  const { loading, cardView, setCardView, email, phoneNumber, telegramId } =
    useNotifiSubscriptionContext();

  const notifiForm = useNotifiForm();

  const resetFormState = useCallback(() => {
    notifiForm.setEmail(email);
    notifiForm.setPhoneNumber(phoneNumber);
    notifiForm.setTelegram(telegramId);
    notifiForm.setEmailErrorMessage('');
    notifiForm.setTelegramErrorMessage('');
    notifiForm.setPhoneNumberErrorMessage('');
  }, [email, phoneNumber, telegramId]);

  const leftIcon: NotifiAlertBoxButtonProps | undefined = useMemo(() => {
    switch (viewState) {
      case 'edit':
        return {
          name: 'back',
          onClick: () => {
            resetFormState();
            setCardView({ state: 'preview' });
          },
        };
      default: // default w/o leftIcon
        return;
    }
  }, [viewState]);

  return (
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        leftIcon={leftIcon}
        rightIcon={headerRightIcon}
      >
        {cardView.state === 'signup' ? (
          <h2>
            {(data.titles?.active && data.titles.signupView) || 'Get Notified'}
          </h2>
        ) : (
          <h2>
            {(data.titles?.active && data.titles.editView) || 'Update Settings'}
          </h2>
        )}
      </NotifiAlertBox>
      <div className={clsx('DividerLine signup', classNames?.dividerLine)} />
      <div
        className={clsx(
          'NotifiInputContainer',
          classNames?.NotifiInputContainer,
        )}
      >
        {showPreview ? (
          <AlertListPreview
            copy={copy?.AlertListPreview}
            classNames={classNames?.AlertListPreview}
            eventTypes={data.eventTypes}
          />
        ) : null}
        {loading ? (
          <div className="NotifiInputContainer__LoadingSpinner">
            <Spinner size="70px" />
          </div>
        ) : (
          <InputFields
            hideContactInputs={showPreview && !data.isContactInfoRequired}
            data={data}
            allowedCountryCodes={allowedCountryCodes}
            inputDisabled={inputDisabled}
            inputSeparators={inputSeparators}
            inputTextFields={inputTextFields}
          />
        )}
        <NotifiSubscribeButton
          buttonText={
            viewState === 'signup'
              ? copy?.buttonText?.signup ?? 'Next'
              : copy?.buttonText?.edit ?? 'Update'
          }
          data={data}
          classNames={classNames?.NotifiSubscribeButton}
          inputs={inputs}
        />
      </div>
    </>
  );
};
