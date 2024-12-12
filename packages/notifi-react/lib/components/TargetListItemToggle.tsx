import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { ToggleTarget, useNotifiTargetContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import { useTargetListItem } from '../hooks/useTargetListItem';
import { isTargetCta, isTargetVerified } from '../utils';
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
  const { isRemoveButtonAvailable, signupCtaProps } = useTargetListItem({
    target: props.target,
    postCta: props.postCta,
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

  const isBeforeVerifyMessageAvailable =
    (isTargetCta(props.targetInfo?.infoPrompt) || !props.targetInfo) &&
    props.message?.beforeVerify;

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
      {/* ICON/ LABEL */}
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
        <label>{props.label}</label>
      </div>
      {/* TODO: Remove, for ref now */}
      {/* {!isTargetVerified(props.targetInfo?.infoPrompt) ||
      props.parentComponent === 'ftu' ||
      props.target === 'wallet' ? null : (
        <div
          className={clsx(
            'notifi-target-list-item-target-id',
            props.classNames?.targetId,
          )}
        >
          {toggleTargetData.data &&
            'username' in toggleTargetData.data! &&
            `@${toggleTargetData.data.username}`}
        </div>
      )} */}

      {userName ? (
        <div
          className={clsx(
            'notifi-target-list-item-target-id',
            props.classNames?.targetId,
          )}
        >
          {`@${userName}`}
        </div>
      ) : null}

      {/* WARNING TEXT BEFORE TARGET VERIFIED (IF APPLICABLE) */}
      {isBeforeVerifyMessageAvailable ? (
        <div
          className={clsx(
            'notifi-target-list-target-verify-message',
            props.classNames?.verifyMessage,
          )}
        >
          {props.message!.beforeVerify}
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
              {props.message!.beforeVerifyTooltip}{' '}
              {props.message!.beforeVerifyTooltipEndingLink ? (
                <a
                  href={props.message!.beforeVerifyTooltipEndingLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.message!.beforeVerifyTooltipEndingLink.text}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* CONFIRMATION MESSAGE AFTER TARGET VERIFIED (IF APPLICABLE) */}
      {props.message?.afterVerify &&
      isTargetVerified(props.targetInfo?.infoPrompt) ? (
        <div
          className={clsx(
            'notifi-target-list-target-confirmed-message',
            props.classNames?.verifyMessage,
            props.parentComponent === 'inbox' ? 'inbox' : '',
          )}
        >
          {props.message.afterVerify}
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
              {props.message.afterVerifyTooltip}{' '}
              {props.message.afterVerifyTooltipEndingLink ? (
                <a
                  href={props.message.afterVerifyTooltipEndingLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.message.afterVerifyTooltipEndingLink.text}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* TARGET STATUS CTA */}
      {props.targetInfo ? (
        <TargetCta
          type={props.targetCtaType}
          targetInfoPrompt={props.targetInfo.infoPrompt}
          classNames={props.classNames?.TargetCta}
          postCta={props.postCta}
          isCtaDisabled={!targetData[props.target].isAvailable}
        />
      ) : (
        <TargetCta {...signupCtaProps} />
      )}

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
