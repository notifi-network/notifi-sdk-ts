import { objectKeys } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { isTargetVerified } from '../utils';
import { defaultCopy } from '../utils/constants';
import { TargetListItem, TargetListItemProps } from './TargetListItem';

type TargetListProps = {
  classNames?: {
    container?: string;
    TargetListItem?: TargetListItemProps['classNames'];
  };
  copy?: {
    email?: string;
    sms?: string;
    telegram?: string;
    discord?: string;
    slack?: string;
    emailVerifyMessage?: string;
    discordVerifiedMessage?: string;
    discordVerifiedPromptTooltip?: string;
    emailCtaCalledSuccessfullyText?: string;
  };
  parentComponent?: 'inbox' | 'ftu';
};

export const TargetList: React.FC<TargetListProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const {
    targetDocument: { targetInfoPrompts, targetData },
  } = useNotifiTargetContext();

  return (
    <div className={clsx('notifi-target-list', props.classNames?.container)}>
      {objectKeys(targetData)
        .sort((key) => {
          // the unconfirmed items should be at the top
          const target = targetInfoPrompts[key];
          if (!target?.infoPrompt) return 1;
          return isTargetVerified(target.infoPrompt) ? 1 : -1;
        })
        .map((target) => {
          // TODO: Extract this logic to a useMemo
          const targetInfo = targetInfoPrompts[target];
          if (!targetInfo || !targetData[target]) return null;
          const targetListItemArgs = {
            target,
            targetInfo,
          } as TargetListItemProps;
          switch (target) {
            case 'email':
              targetListItemArgs.iconType = 'email';
              targetListItemArgs.label =
                props.copy?.email ?? defaultCopy.targetList.email;
              targetListItemArgs.targetCtaType = 'link';
              targetListItemArgs.message = {
                beforeVerify:
                  props.copy?.emailVerifyMessage ??
                  defaultCopy.targetList.emailVerifyMessage,
              };
              targetListItemArgs.ctaCalledSuccessfullyText =
                props.copy?.emailCtaCalledSuccessfullyText ??
                defaultCopy.targetList.emailCtaCalledSuccessfullyText;
              break;
            case 'phoneNumber':
              targetListItemArgs.iconType = 'sms';
              targetListItemArgs.label =
                props.copy?.sms ?? defaultCopy.targetList.phoneNumber;
              targetListItemArgs.targetCtaType = 'button';
              break;
            case 'telegram':
              targetListItemArgs.iconType = 'telegram';
              targetListItemArgs.label =
                props.copy?.telegram ?? defaultCopy.targetList.telegram;
              targetListItemArgs.targetCtaType = 'button';
              break;
            case 'discord':
              if (!targetData[target].useDiscord) return null;
              targetListItemArgs.iconType = 'discord';
              targetListItemArgs.label = defaultCopy.targetList.discord;
              targetListItemArgs.targetCtaType = 'button';
              targetListItemArgs.message = {
                afterVerify:
                  props.copy?.discordVerifiedMessage ??
                  defaultCopy.targetList.discordVerifiedMessage,
                afterVerifyTooltip:
                  props.copy?.discordVerifiedPromptTooltip ??
                  defaultCopy.targetList.discordVerifiedPromptTooltip,
              };
              break;
            case 'slack':
              if (!targetData[target].useSlack) return null;
              targetListItemArgs.iconType = 'slack';
              targetListItemArgs.label = defaultCopy.targetList.slack;
              targetListItemArgs.targetCtaType = 'button';
              break;
          }

          return (
            <TargetListItem
              key={target}
              {...targetListItemArgs}
              parentComponent={parentComponent}
              classNames={props.classNames?.TargetListItem}
            />
          );
        })}
    </div>
  );
};
