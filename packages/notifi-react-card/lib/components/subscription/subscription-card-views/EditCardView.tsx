import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
import { WalletList } from '../../WalletList';
import {
  NotifiSubscribeButton,
  NotifiSubscribeButtonProps,
} from '../NotifiSubscribeButton';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from '../NotifiSubscriptionCard';
import { AlertListPreview } from './AlertListPreview';
import { InputFields, InputFieldsProps } from './InputFields';

export type EditCardViewProps = Readonly<{
  buttonText?: string;
  data: CardConfigItemV1;
  inputDisabled: boolean;
  classNames?: Readonly<{
    NotifiInputContainer?: string;
    InputFields?: DeepPartialReadonly<InputFieldsProps['classNames']>;
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
  }>;
  inputSeparators?: NotifiInputSeparators;
  inputTextFields?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  allowedCountryCodes,
  buttonText,
  classNames,
  data,
  inputDisabled,
  inputSeparators,
  inputTextFields,
}) => {
  return (
    <div
      className={clsx('NotifiInputContainer', classNames?.NotifiInputContainer)}
    >
      <WalletList />

      <AlertListPreview eventTypes={data.eventTypes} />

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
