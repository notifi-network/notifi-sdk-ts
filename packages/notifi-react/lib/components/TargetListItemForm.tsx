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
    // postCta: props.postCta, // TODO: remove postCta related
    message: props.message,
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
      {/*  ICON / LABEL  / INPUT FIELD */}
      <div className="notifi-target-list-item-content">
        <div
          className={clsx(
            'notifi-target-list-item-target',
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
            {/* TODO: Line clamp under certain width */}
            {targetData[props.target] || <label>{props.label}</label>}
            {/* VERIFIED CHECK ICON */}
            {!!props.targetInfo &&
            props.targetInfo.infoPrompt.message === 'Verified' ? (
              <TargetCta
                type={props.targetCtaType}
                targetInfoPrompt={props.targetInfo.infoPrompt}
                classNames={props.classNames?.TargetCta}
              />
            ) : null}
          </div>
        </div>

        {/* TARGET SIGNUP CTA */}
        {!props.targetInfo &&
        !targetInputs[props.target].error &&
        targetInputs[props.target].value ? (
          <TargetCta
            {...signupCtaProps}
            classNames={props.classNames?.TargetCta}
          />
        ) : null}
      </div>

      {!props.targetInfo ? (
        <div className="notifi-target-list-item-input-form">
          <TargetInputField
            targetType={props.target}
            validateRegex={getTargetValidateRegex(props.target)}
          />
        </div>
      ) : null}

      {/* TARGET STATUS MESSAGE */}
      {classifiedTargetListItemMessage ? (
        <div
          className={clsx(
            'notifi-target-list-item-warning',
            props.classNames?.verifyMessage,
          )}
        >
          {classifiedTargetListItemMessage.content}
          {/* TODO: create tooltip component */}
          {/* {classifiedTargetListItemMessage.tooltip && (
            <div className={'notifi-target-list-item-tooltip'} ref={tooltipRef}>
              <Icon
                className={clsx(
                  'notifi-target-list-item-tooltip-icon',
                  props.classNames?.tooltipIcon,
                )}
                type="info"
              />
              <div
                className={clsx(
                  'notifi-target-list-item-tooltip-content',
                  props.classNames?.tooltipContent,
                  props.parentComponent === 'inbox' ? 'inbox' : '',
                  tooltipIconPosition,
                )}
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
              </div>
            </div>
          )} */}
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
              // postCta={props.postCta} // TODO: remove postCta related
            />
          ) : null}
        </div>
      ) : null}
      {/* REMOVE TARGET CTA */}
      {isRemoveButtonAvailable ? (
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
          }}
        />
      ) : null}
    </div>
  );
};
