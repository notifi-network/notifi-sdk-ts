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
import { TargetListItemAction } from './TargetListItemAction';

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
    // postCta: props.postCta, // TODO: remove postCta related
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
            {userName ? `@${userName}` : <label>{props.label}</label>}
          </div>
        </div>

        {/* TARGET STATUS CTA */}
        {/* TODO: refactor (combine to one) */}
        {props.targetInfo ? (
          <TargetCta
            type={props.targetCtaType}
            targetInfoPrompt={props.targetInfo.infoPrompt}
            classNames={props.classNames?.TargetCta}
            // postCta={props.postCta} // TODO: remove postCta related
            isCtaDisabled={!targetData[props.target].isAvailable}
          />
        ) : (
          <TargetCta {...signupCtaProps} />
        )}
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
          {/* TODO: create tooltip component */}
          {classifiedTargetListItemMessage.tooltip && (
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
          )}
        </div>
      ) : null}
      {/* TODO: remove postCta related */}
      {/* TARGET STATUS CTA */}
      {/* {props.targetInfo ? (
        <TargetCta
          type={props.targetCtaType}
          targetInfoPrompt={props.targetInfo.infoPrompt}
          classNames={props.classNames?.TargetCta}
          postCta={props.postCta}
          isCtaDisabled={!targetData[props.target].isAvailable}
        />
      ) : (
        <TargetCta {...signupCtaProps} />
      )} */}

      {/* REMOVE CTA */}
      {isRemoveButtonAvailable ? (
        <TargetListItemAction
          action={async () => {
            // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
            // updateTargetInputs(props.target, false); // TODO: remove
            renewTargetGroup({
              target: props.target as ToggleTarget,
              value: false,
            });
          }}
          classNames={{ removeCta: props.classNames?.removeCta }}
        />
      ) : null}
    </div>
  );
};
