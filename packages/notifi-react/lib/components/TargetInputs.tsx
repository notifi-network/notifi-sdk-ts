import clsx from 'clsx';
import React from 'react';

import { IconType } from '../assets/Icons';
import { Target, useNotifiTenantConfigContext } from '../context';
import { validationRegex } from '../utils/constants';
import { TargetInputField, TargetInputFieldProps } from './TargetInputField';
import { TargetInputToggle } from './TargetInputToggle';

export type TargetInputsProps = {
  copy?: {
    iconType?: Partial<
      Record<Extract<Target, 'email' | 'telegram' | 'phoneNumber'>, IconType>
    >;
    targetInputFields?: Partial<
      Record<
        Extract<Target, 'email' | 'telegram' | 'phoneNumber'>,
        TargetInputFieldProps['copy']
      >
    >;
    inputSeparators?: {
      email?: string;
      sms?: string;
      telegram?: string;
      slack?: string;
      discord?: string;
    };
  };
  classNames?: {
    container?: string;
    targetInputField?: Record<
      Extract<Target, 'email' | 'telegram' | 'phoneNumber'>,
      TargetInputFieldProps['classNames']
    >;
    inputSeparators?: {
      email?: string;
      sms?: string;
      telegram?: string;
      slack?: string;
      discord?: string;
    };
  };
};

export const TargetInputs: React.FC<TargetInputsProps> = (props) => {
  const { cardConfig } = useNotifiTenantConfigContext();
  console.log(props);
  return (
    <div className={clsx('notifi-target-inputs', props.classNames?.container)}>
      {cardConfig?.contactInfo.email?.active ? (
        <>
          <TargetInputField
            copy={props.copy?.targetInputFields?.email}
            classNames={props.classNames?.targetInputField?.email}
            targetType="email"
            iconType={props.copy?.iconType?.email ?? 'email'}
            validateRegex={validationRegex.email}
          />
          {props.copy?.inputSeparators?.email ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.email,
              )}
            >
              <div>{props.copy?.inputSeparators?.email}</div>
            </div>
          ) : null}
        </>
      ) : null}
      {cardConfig?.contactInfo.sms?.active ? (
        <>
          <TargetInputField
            copy={props.copy?.targetInputFields?.phoneNumber}
            classNames={props.classNames?.targetInputField?.phoneNumber}
            targetType="phoneNumber"
            iconType={props.copy?.iconType?.phoneNumber ?? 'sms'}
          />
          {props.copy?.inputSeparators?.sms ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.sms,
              )}
            >
              <div>{props.copy?.inputSeparators?.sms}</div>
            </div>
          ) : null}
        </>
      ) : null}
      {cardConfig?.contactInfo.telegram?.active ? (
        <>
          <TargetInputField
            copy={props.copy?.targetInputFields?.telegram}
            classNames={props.classNames?.targetInputField?.telegram}
            targetType="telegram"
            iconType={props.copy?.iconType?.telegram ?? 'telegram'}
          />
          {props.copy?.inputSeparators?.telegram ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.telegram,
              )}
            >
              <div>{props.copy?.inputSeparators?.telegram}</div>
            </div>
          ) : null}
        </>
      ) : null}
      {cardConfig?.contactInfo.discord?.active ? (
        // TODO: impl disable
        <>
          <TargetInputToggle targetType="slack" disabled={false} />
          {props.copy?.inputSeparators?.discord ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.discord,
              )}
            >
              <div>{props.copy?.inputSeparators?.discord}</div>
            </div>
          ) : null}
        </>
      ) : null}
      {cardConfig?.contactInfo.slack?.active ? (
        <>
          <TargetInputToggle targetType="discord" disabled={false} />
          {props.copy?.inputSeparators?.slack ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.slack,
              )}
            >
              <div>{props.copy?.inputSeparators?.slack}</div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
