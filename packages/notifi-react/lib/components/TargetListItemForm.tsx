import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { FormTarget, useNotifiTargetContext } from '../context';
import { useTargetListItem } from '../hooks/useTargetListItem';
import {
  getTargetValidateRegex,
  isTargetCta,
  isTargetVerified,
} from '../utils';
import { TargetCta } from './TargetCta';
import { TargetInputField } from './TargetInputField';
import { TargetListItemFromProps, TargetListItemProps } from './TargetListItem';
import { TargetListItemAction } from './TargetListItemAction';

// TODO: confirm the cross import between this component and TargetListItem causes no issues

export const TargetListItemForm: React.FC<TargetListItemFromProps> = (
  props,
) => {
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
  } = useNotifiTargetContext();
  const { isRemoveButtonAvailable, signupCtaProps } = useTargetListItem({
    target: props.target,
    postCta: props.postCta,
  });

  return (
    <div
      className={clsx(
        'notifi-target-list-item',
        props.classNames?.targetListItem,
        // NOTE: only used when we want to adopt different style for verified items
        isTargetVerified(props.targetInfo?.infoPrompt) &&
          props.classNames?.targetListVerifiedItem,
      )}
    >
      <div
        className={clsx(
          'notifi-target-list-item-target',
          props.classNames?.targetListItemTarget,
        )}
      >
        <Icon
          type={props.iconType}
          className={clsx('notifi-target-list-icon', props.classNames?.icon)}
        />
        <div
          className={clsx(
            'notifi-target-list-item-target-id',
            props.classNames?.targetId,
          )}
        >
          {/** TODO: Move to use memo once the target display id > 1 format */}
          {targetData[props.target]}
        </div>
        {/* TODO */}
        {!props.targetInfo ? (
          <>
            <label>{props.label}</label>{' '}
            <TargetInputField
              targetType={props.target}
              validateRegex={getTargetValidateRegex(props.target)}
            />
          </>
        ) : null}
      </div>
      {/* TODO: impl after verify message for form targets */}
      {props.message?.beforeVerify &&
      isTargetCta(props.targetInfo?.infoPrompt) ? (
        <div
          className={clsx(
            'notifi-target-list-target-verify-message',
            props.classNames?.verifyMessage,
          )}
        >
          {props.message.beforeVerify}
        </div>
      ) : null}

      {props.targetInfo ? (
        <TargetCta
          type={props.targetCtaType}
          targetInfoPrompt={props.targetInfo.infoPrompt}
          classNames={props.classNames?.TargetCta}
          postCta={props.postCta}
        />
      ) : (
        <>
          {!targetInputs[props.target].error &&
          targetInputs[props.target].value ? (
            // TODO: not yet consider class names
            <TargetCta {...signupCtaProps} />
          ) : null}
        </>
      )}
      {isRemoveButtonAvailable ? (
        <TargetListItemAction
          action={async () => {
            const target = props.target as FormTarget;
            updateTargetInputs(target, { value: '' });
            renewTargetGroup({
              target: target,
              value: '',
            });
          }}
          classNames={{ removeCta: props.classNames?.removeCta }}
        />
      ) : null}
    </div>
  );
};
