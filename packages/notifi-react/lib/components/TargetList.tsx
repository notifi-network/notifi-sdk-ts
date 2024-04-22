import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { TargetCta } from './TargetCta';

type TargetListProps = {
  classNames?: {
    container?: string;
    targetListItem?: string;
    targetListItemTarget?: string;
    icon?: string;
  };
  copy?: {
    email?: string;
    sms?: string;
    telegram?: string;
    discord?: string;
    slack?: string;
  };
};

export const TargetList: React.FC<TargetListProps> = (props) => {
  const {
    targetDocument: { targetInfoPrompts, targetData },
  } = useNotifiTargetContext();
  // TODO: extract to a separate component for each target
  return (
    <div className={clsx('notifi-target-list', props.classNames?.container)}>
      {targetData.email && targetInfoPrompts.email?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
          )}
        >
          <div className={'notifi-target-list-item-target'}>
            <Icon
              type="email"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>{props.copy?.email ?? defaultCopy.targetList.email}</label>
          </div>

          {targetInfoPrompts.email.infoPrompt.type === 'message' ? null : (
            <div>{targetData.email}</div>
          )}
          <TargetCta
            type="link"
            targetInfoPrompt={targetInfoPrompts.email.infoPrompt}
            ctaCalledSuccessfullyText="Email sent"
          />
        </div>
      ) : null}

      {targetData.phoneNumber && targetInfoPrompts.phoneNumber?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
          )}
        >
          <div
            className={clsx(
              'notifi-target-list-item-target',
              props.classNames?.targetListItemTarget,
            )}
          >
            <Icon
              type="sms"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.sms ?? defaultCopy.targetList.phoneNumber}
            </label>
          </div>

          {targetInfoPrompts.phoneNumber.infoPrompt.type ===
          'message' ? null : (
            <div>{targetData.phoneNumber}</div>
          )}
          <TargetCta
            type="link"
            targetInfoPrompt={targetInfoPrompts.phoneNumber.infoPrompt}
          />
        </div>
      ) : null}

      {targetData.telegram && targetInfoPrompts.telegram?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
          )}
        >
          <div
            className={clsx(
              'notifi-target-list-item-target',
              props.classNames?.targetListItemTarget,
            )}
          >
            <Icon
              type="telegram"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.telegram ?? defaultCopy.targetList.telegram}
            </label>
          </div>

          {targetInfoPrompts.telegram.infoPrompt.type === 'message' ? null : (
            <div>{targetData.telegram}</div>
          )}
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.telegram.infoPrompt}
          />
        </div>
      ) : null}

      {targetData.discord.useDiscord &&
      targetInfoPrompts.discord?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
          )}
        >
          <div
            className={clsx(
              'notifi-target-list-item-target',
              props.classNames?.targetListItemTarget,
            )}
          >
            <Icon
              type="discord"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.discord ?? defaultCopy.targetList.discord}
            </label>
          </div>
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.discord.infoPrompt}
          />
        </div>
      ) : null}

      {targetData.slack.useSlack && targetInfoPrompts.slack?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
          )}
        >
          <div
            className={clsx(
              'notifi-target-list-item-target',
              props.classNames?.targetListItemTarget,
            )}
          >
            <Icon
              type="slack"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>{props.copy?.slack ?? defaultCopy.targetList.slack}</label>
          </div>
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.slack.infoPrompt}
          />
        </div>
      ) : null}
    </div>
  );
};
