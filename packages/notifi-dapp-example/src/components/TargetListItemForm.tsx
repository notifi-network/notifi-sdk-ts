import { Icon } from '@/assets/Icon';
import { useTargetListItem } from '@/hooks/useTargetListItem';
import {
  FormTarget,
  getTargetValidateRegex,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { Tooltip } from '../../Tooltip';
import { TargetCta } from './TargetCta';
import { TargetInputField } from './TargetInputField';
import { TargetListItemFromProps } from './TargetListItem';

export const TargetListItemForm: React.FC<TargetListItemFromProps> = (
  props,
) => {
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
  } = useNotifiTargetContext();
  const {
    isRemoveButtonAvailable,
    signupCtaProps,
    classifiedTargetListItemMessage,
  } = useTargetListItem({
    target: props.target,
    message: props.message,
  });

  return (
    <div
      className={`bg-notifi-destination-card-bg rounded-xl w-[320px] ${isRemoveButtonAvailable ? 'relative pb-4' : ''}`}
    >
      {/*  ICON / LABEL  / INPUT FIELD */}
      <div
        className={`flex flex-row justify-between px-[14px] pt-4 ${isRemoveButtonAvailable ? 'pb-4' : ''}`}
      >
        <div className={`flex flex-row justify-center items-center`}>
          <Icon
            id={props.iconType}
            width="15px"
            height="12px"
            className="text-notifi-toggle-on-bg mr-[6px]"
          />

          <div className="font-medium text-sm text-notifi-grey-text">
            {targetData[props.target] || <label>{props.label}</label>}
            {/* VERIFIED CHECK ICON */}
            {!!props.targetInfo &&
            props.targetInfo.infoPrompt.message === 'Verified' ? (
              <TargetCta
                type={props.targetCtaType}
                targetInfoPrompt={props.targetInfo.infoPrompt}
              />
            ) : null}
          </div>
        </div>

        {/* TARGET SIGNUP CTA */}
        {!props.targetInfo &&
        !targetInputs[props.target].error &&
        targetInputs[props.target].value ? (
          <TargetCta {...signupCtaProps} />
        ) : null}
      </div>

      {!props.targetInfo ? (
        <div className="mt-[10px] px-[14px] pb-4">
          <TargetInputField
            targetType={props.target}
            validateRegex={getTargetValidateRegex(props.target)}
          />
        </div>
      ) : null}

      {/* TARGET STATUS MESSAGE */}
      {classifiedTargetListItemMessage ? (
        <div className="flex flex-row text-sm bg-notifi-container-bg px-[14px] py-2 rounded-b-xl text-notifi-text-light">
          {classifiedTargetListItemMessage.content}
          {classifiedTargetListItemMessage.tooltip && (
            <Tooltip>
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
        />
      ) : null}
    </div>
  );
};
