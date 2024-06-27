import clsx from 'clsx';
import React from 'react';

import { IconType } from '../assets/Icons';
import { FormTarget, Target, useNotifiTenantConfigContext } from '../context';
import { validationRegex } from '../utils/constants';
import { TargetInputField, TargetInputFieldProps } from './TargetInputField';
import { TargetInputToggle, TargetInputToggleProps } from './TargetInputToggle';

export type TargetInputsProps = {
  formTargetsOnFocus?: (target: FormTarget) => void;
  formTargetsOnBlur?: (target: FormTarget) => void;
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
      wallet?: string;
    };
    TargetInputToggle?: TargetInputToggleProps['copy'];
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
      wallet?: string;
    };
    TargetInputToggle: TargetInputToggleProps['classNames'];
  };
};

export const TargetInputs: React.FC<TargetInputsProps> = (props) => {
  const { cardConfig } = useNotifiTenantConfigContext();
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
            onFocus={props.formTargetsOnFocus}
            onBlur={props.formTargetsOnBlur}
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
            onFocus={props.formTargetsOnFocus}
            onBlur={props.formTargetsOnBlur}
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
            validateRegex={validationRegex.telegram}
            onFocus={props.formTargetsOnFocus}
            onBlur={props.formTargetsOnBlur}
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
          <TargetInputToggle
            targetType="discord"
            disabled={false}
            copy={props.copy?.TargetInputToggle}
            classNames={props.classNames?.TargetInputToggle}
          />
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
          <TargetInputToggle
            targetType="slack"
            disabled={false}
            copy={props.copy?.TargetInputToggle}
            classNames={props.classNames?.TargetInputToggle}
          />
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
      {cardConfig?.contactInfo.wallet?.active ? (
        <>
          <TargetInputToggle
            targetType="wallet"
            disabled={false}
            copy={props.copy?.TargetInputToggle}
            classNames={props.classNames?.TargetInputToggle}
          />
          {props.copy?.inputSeparators?.wallet ? (
            <div
              className={clsx(
                'notifi-input-separator',
                props.classNames?.inputSeparators?.wallet,
              )}
            >
              <div>{props.copy?.inputSeparators?.wallet}</div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
