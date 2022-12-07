import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
import {
  NotifiSubscribeButton,
  NotifiSubscribeButtonProps,
} from '../NotifiSubscribeButton';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../NotifiSubscriptionCard';
import { AlertListPreview } from './AlertListPreview';
import {
  HideStartIconProps,
  InputFields,
  InputFieldsProps,
} from './InputFields';

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
  inputLabels?: NotifiInputLabels;
  allowedCountryCodes: string[];
  hideAlertListPreview?: boolean;
  hideStartIcons?: HideStartIconProps;
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  allowedCountryCodes,
  buttonText,
  classNames,
  data,
  inputDisabled,
  inputSeparators,
  inputLabels,
  hideAlertListPreview,
  hideStartIcons,
}) => {
  return (
    <div
      className={clsx('NotifiInputContainer', classNames?.NotifiInputContainer)}
    >
      {hideAlertListPreview ? null : (
        <AlertListPreview eventTypes={data.eventTypes} />
      )}

      <InputFields
        data={data}
        allowedCountryCodes={allowedCountryCodes}
        inputDisabled={inputDisabled}
        inputSeparators={inputSeparators}
        inputLabels={inputLabels}
        hideStartIcons={hideStartIcons}
      />
      <NotifiSubscribeButton
        buttonText={buttonText}
        data={data}
        classNames={classNames?.NotifiSubscribeButton}
      />
    </div>
  );
};
