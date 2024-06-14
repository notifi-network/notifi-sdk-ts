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

  const targetListItemArgsList = React.useMemo(() => {
    // TODO: Move to custom hook when it gets too complex
    const order = [
      'email',
      'phoneNumber',
      'telegram',
      'discord',
      'slack',
      'wallet',
    ];
    const verifiedTargets = objectKeys(targetData)
      .filter((target) => {
        const targetInfo = targetInfoPrompts[target];
        return targetInfo ? isTargetVerified(targetInfo.infoPrompt) : false;
      })
      .sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });

    const unverifiedTargets = objectKeys(targetData)
      .filter((target) => !verifiedTargets.includes(target))
      .sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });

    return [...unverifiedTargets, ...verifiedTargets].map((target) => {
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
        case 'wallet':
          if (!targetData[target].useWallet) return null;
          targetListItemArgs.iconType = 'connect';
          targetListItemArgs.label = defaultCopy.targetList.wallet;
          targetListItemArgs.targetCtaType = 'button';
          // TODO: Add to copy
          targetListItemArgs.message = {
            beforeVerify: '2-3 signatures required to verify',
            beforeVerifyTooltip:
              'Wallet messages are powered by XMTP and delivered natively into Coinbase Wallet. Download the Coinbase Wallet App.',
            afterVerify: 'Enable messages in Coinbase Wallet App',
            afterVerifyTooltip:
              'Make sure messages are enabled in your Coinbase Wallet Mobile App. More info',
          };
          break;
      }

      return targetListItemArgs;
    });
  }, [targetData, targetInfoPrompts]);

  return (
    <div className={clsx('notifi-target-list', props.classNames?.container)}>
      {targetListItemArgsList.map((targetListItemArgs) => {
        if (!targetListItemArgs) return null;
        return (
          <TargetListItem
            key={targetListItemArgs.target}
            {...targetListItemArgs}
            parentComponent={parentComponent}
            classNames={props.classNames?.TargetListItem}
          />
        );
      })}
    </div>
  );
};
