import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
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
  buttonText: string;
  data: CardConfigItemV1;
  inputDisabled: boolean;
  showPreview?: boolean;
  copy?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['copy'];
  }>;
  classNames?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['classNames'];
    NotifiInputContainer?: string;
    InputFields?: DeepPartialReadonly<InputFieldsProps['classNames']>;
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiInputHeading?: string;
  }>;
  inputSeparators?: NotifiInputSeparators;
  inputTextFields?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  allowedCountryCodes,
  buttonText,
  copy,
  classNames,
  showPreview,
  data,
  inputDisabled,
  inputSeparators,
  inputTextFields,
}) => {
  return (
    <div
      className={clsx('NotifiInputContainer', classNames?.NotifiInputContainer)}
    >
      {showPreview ? (
        <AlertListPreview
          copy={copy?.AlertListPreview}
          classNames={classNames?.AlertListPreview}
          eventTypes={data.eventTypes}
        />
      ) : null}

      <InputFields
        data={data}
        allowedCountryCodes={allowedCountryCodes}
        inputDisabled={inputDisabled}
        inputSeparators={inputSeparators}
        inputTextFields={inputTextFields}
      />
      <NotifiSubscribeButton
        buttonText={buttonText}
        data={data}
        classNames={classNames?.NotifiSubscribeButton}
      />
    </div>
  );
};
