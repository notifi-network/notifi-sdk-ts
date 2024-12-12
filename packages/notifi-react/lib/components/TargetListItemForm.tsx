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
import { TargetListItemFromProps } from './TargetListItem';
import { TargetListItemAction } from './TargetListItemAction';

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

  const isBeforeVerifyMessageAvailable =
    isTargetCta(props.targetInfo?.infoPrompt) && props.message?.beforeVerify;

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
      {/*  ICON / LABEL  / INPUT FIELD */}
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
          {targetData[props.target]}
        </div>
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

      {/* WARNING TEXT BEFORE TARGET VERIFIED */}
      {isBeforeVerifyMessageAvailable ? (
        <div
          className={clsx(
            'notifi-target-list-target-verify-message',
            props.classNames?.verifyMessage,
          )}
        >
          {props.message!.beforeVerify}
        </div>
      ) : null}

      {/* TARGET STATUS CTA */}
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
            <TargetCta
              {...signupCtaProps}
              classNames={props.classNames?.TargetCta}
            />
          ) : null}
        </>
      )}

      {/* REMOVE CTA */}
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
