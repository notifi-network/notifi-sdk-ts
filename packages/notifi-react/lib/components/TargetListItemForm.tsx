import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { FormTarget, useNotifiTargetContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import { useTargetListItem } from '../hooks/useTargetListItem';
import { getTargetValidateRegex, isTargetVerified } from '../utils';
import { TargetCta } from './TargetCta';
import { TargetInputField } from './TargetInputField';
import { TargetListItemFromProps } from './TargetListItem';
import { Tooltip } from './Tooltip';

export const TargetListItemForm: React.FC<TargetListItemFromProps> = (
  props,
) => {
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
  } = useNotifiTargetContext();
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { componentPosition: tooltipIconPosition } = useComponentPosition(
    tooltipRef,
    props.parentComponent === 'inbox'
      ? 'notifi-inbox-config-target-list-main'
      : 'notifi-ftu-target-list-main',
  );
  const {
    isRemoveButtonAvailable,
    signupCtaProps,
    classifiedTargetListItemMessage,
  } = useTargetListItem({
    target: props.target,
    message: props.message,
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const originalValueRef = React.useRef<string>('');

  const handleEdit = () => {
    const target = props.target as FormTarget;
    originalValueRef.current = targetInputs[target].value;
    setIsEditing(true);
  };

  const handleCancel = () => {
    const target = props.target as FormTarget;
    updateTargetInputs(target, { value: originalValueRef.current });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const target = props.target as FormTarget;
    await renewTargetGroup({
      target: target,
      value: targetInputs[target].value,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEditing(false);
  };

  const showInputForm = !props.targetInfo || isEditing;

  const editableSignupCtaProps = isEditing
    ? {
        ...signupCtaProps,
        targetInfoPrompt: {
          type: 'cta' as const,
          message: 'Save',
          onClick: handleSave,
        },
      }
    : signupCtaProps;

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
      <div className="notifi-target-list-item-content">
        <div
          className={clsx(
            'notifi-target-list-item-target',
            isRemoveButtonAvailable && 'has-remove-button',
            props.classNames?.targetListItemTarget,
          )}
        >
          <div
            className={clsx('notifi-target-list-icon', props.classNames?.icon)}
          >
            <Icon type={props.iconType} />
          </div>

          <div
            className={clsx(
              'notifi-target-list-item-target-id',
              props.classNames?.targetId,
            )}
          >
            {isEditing ? `Edit ${props.label}` : (targetData[props.target] || <label>{props.label}</label>)}
            {/* VERIFIED CHECK ICON */}
            {!!props.targetInfo &&
            props.targetInfo.infoPrompt.message === 'Verified' &&
            !isEditing ? (
              <TargetCta
                type={props.targetCtaType}
                targetInfoPrompt={props.targetInfo.infoPrompt}
                classNames={props.classNames?.TargetCta}
              />
            ) : null}
          </div>

          {/* EDIT ICON */}
          {props.targetInfo && !isEditing ? (
            <div
              className="notifi-target-list-item-edit-icon"
              onClick={handleEdit}
              style={{ cursor: 'pointer' }}
            >
              <Icon type="edit" />
            </div>
          ) : null}
        </div>

        {/* TARGET SIGNUP CTA */}
        {!isEditing &&
        !props.targetInfo &&
        !targetInputs[props.target].error &&
        targetInputs[props.target].value ? (
          <TargetCta
            {...editableSignupCtaProps}
            classNames={props.classNames?.TargetCta}
          />
        ) : null}
        {/* SAVE BUTTON WHEN EDITING */}
        {isEditing &&
        !targetInputs[props.target].error &&
        targetInputs[props.target].value ? (
          <TargetCta
            {...editableSignupCtaProps}
            classNames={props.classNames?.TargetCta}
          />
        ) : null}
        {/* CANCEL BUTTON WHEN EDITING */}
        {isEditing ? (
          <TargetCta
            type="link"
            targetInfoPrompt={{
              type: 'cta',
              message: 'Cancel',
              onClick: handleCancel,
            }}
            classNames={{
              container: 'notifi-target-list-item-cancel',
              actionRequired: {
                link: 'notifi-target-list-item-cancel-link',
              },
            }}
          />
        ) : null}
      </div>

      {showInputForm ? (
        <div className="notifi-target-list-item-input-form">
          <TargetInputField
            targetType={props.target}
            validateRegex={getTargetValidateRegex(props.target)}
          />
        </div>
      ) : null}

      {/* TARGET STATUS MESSAGE */}
      {classifiedTargetListItemMessage && !isEditing ? (
        <div
          className={clsx(
            'notifi-target-list-item-warning',
            props.classNames?.verifyMessage,
          )}
        >
          {classifiedTargetListItemMessage.content}
          {classifiedTargetListItemMessage.tooltip && (
            <Tooltip
              tooltipRef={tooltipRef}
              tooltipIconPosition={tooltipIconPosition}
            >
              {classifiedTargetListItemMessage.tooltip}
              {classifiedTargetListItemMessage.tooltipEndingLink ? (
                <a
                  href={classifiedTargetListItemMessage.tooltipEndingLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {classifiedTargetListItemMessage.tooltipEndingLink.text}
                </a>
              ) : null}
            </Tooltip>
          )}

          {/* Warning CTA */}
          {props.targetInfo ? (
            <TargetCta
              type={props.targetCtaType}
              targetInfoPrompt={props.targetInfo.infoPrompt}
              classNames={props.classNames?.TargetCta}
            />
          ) : null}
        </div>
      ) : null}
      {/* REMOVE TARGET CTA */}
      {isRemoveButtonAvailable && !isEditing ? (
        <TargetCta
          type="link"
          targetInfoPrompt={{
            type: 'cta',
            message: 'Remove',
            onClick: async () => {
              const target = props.target as FormTarget;
              updateTargetInputs(target, { value: '' });
              renewTargetGroup({
                target: target,
                value: '',
              });
            },
          }}
          classNames={{
            container: 'notifi-target-list-item-remove',
            actionRequired: {
              link: 'notifi-target-list-item-remove-link',
            },
          }}
        />
      ) : null}
    </div>
  );
};
