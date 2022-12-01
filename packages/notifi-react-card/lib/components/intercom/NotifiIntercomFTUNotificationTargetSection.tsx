import clsx from 'clsx';
import React from 'react';

import { IntercomCardConfigItemV1 } from '../../hooks/IntercomCardConfig';
import { NotifiEmailInput, NotifiEmailInputProps } from '../NotifiEmailInput';
import {
  NotifiTelegramInput,
  NotifiTelegramInputProps,
} from '../NotifiTelegramInput';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import { NotifiToggleProps } from '../subscription/NotifiToggle';

export type NotifiIntercomFTUNotificationTargetSectionProps = Readonly<{
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
  data: IntercomCardConfigItemV1;
  inputs: Record<string, string | undefined>;
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
}>;

export const NotifiIntercomFTUNotificationTargetSection: React.FC<
  NotifiIntercomFTUNotificationTargetSectionProps
> = ({ data, inputSeparators, classNames, inputLabels }) => {
  return (
    <div className={'NotifiSupportNotificationOption__container'}>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          disabled={false}
          classNames={classNames?.NotifiEmailInput}
          copy={{ label: inputLabels?.email }}
          intercomEmailInputContainerStyle={
            'NotifiIntercomEmailInput__container'
          }
          intercomEmailInputStyle={'NotifiIntercomEmailInput__input'}
          intercomView={true}
        />
      ) : null}
      {inputSeparators?.emailSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            'NotifiIntercomInputSeparator__container',
            inputSeparators?.emailSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.emailSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.emailSeparator?.content}
          </div>
        </div>
      ) : null}
      {data.contactInfo.telegram.active ? (
        <NotifiTelegramInput
          disabled={false}
          classNames={classNames?.NotifiTelegramInput}
          copy={{ label: inputLabels?.telegram }}
          intercomTelegramInputContainerStyle={
            'NotifiIntercomTelegramInput__container'
          }
          intercomTelegramInputStyle={'NotifiIntercomTelegramInput__input'}
          intercomView={true}
        />
      ) : null}
    </div>
  );
};
