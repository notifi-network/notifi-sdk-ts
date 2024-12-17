import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { ToggleTarget, useNotifiTargetContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import { useTargetListItem } from '../hooks/useTargetListItem';
import { isTargetVerified } from '../utils';
import { TargetCta } from './TargetCta';
import { TargetListItemToggleProps } from './TargetListItem';
import { Tooltip } from './Tooltip';

export const TargetListItemToggle: React.FC<TargetListItemToggleProps> = (
  props,
) => {
  const {
    targetDocument: { targetData },
    renewTargetGroup,
  } = useNotifiTargetContext();
  const {
    isRemoveButtonAvailable,
    signupCtaProps,
    classifiedTargetListItemMessage,
  } = useTargetListItem({
    target: props.target,
    message: props.message,
  });
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { componentPosition: tooltipIconPosition } = useComponentPosition(
    tooltipRef,
    props.parentComponent === 'inbox'
      ? 'notifi-inbox-config-target-list-main'
      : 'notifi-ftu-target-list-main',
  );
  const toggleTargetData = targetData[props.target];

  const userName = React.useMemo(() => {
    if (!toggleTargetData.data) return null;
    switch (props.target) {
      case 'discord':
        return (
          (toggleTargetData.data as Types.DiscordTargetFragmentFragment)
            .username ?? null
        );
      case 'slack':
        return (
          (toggleTargetData.data as Types.SlackChannelTargetFragmentFragment)
            .slackChannelName ?? null
        );
      default:
        return null;
    }
  }, [toggleTargetData.data, props.target]);

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
      {/* ICON/ LABEL / USERNAME */}
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
            {userName ? `@${userName}` : <label>{props.label}</label>}

            {/* TARGET SIGNUP CTA */}
            {props.targetInfo &&
            props.targetInfo.infoPrompt.message === 'Verified' ? (
              <TargetCta
                type={props.targetCtaType}
                targetInfoPrompt={props.targetInfo.infoPrompt}
                classNames={props.classNames?.TargetCta}
                isCtaDisabled={!targetData[props.target].isAvailable}
              />
            ) : null}
          </div>
        </div>

        {!props.targetInfo ? <TargetCta {...signupCtaProps} /> : null}
      </div>

      {/* TARGET STATUS MESSAGE */}
      {classifiedTargetListItemMessage ? (
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
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // updateTargetInputs(props.target, false); // TODO: remove
              renewTargetGroup({
                target: props.target as ToggleTarget,
                value: false,
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
