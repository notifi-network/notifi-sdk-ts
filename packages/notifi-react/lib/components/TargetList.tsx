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
    wallet?: string;
    postCtaEmail?: string;
    postCtaEmailDurationInMs?: number;
    postCtaTelegram?: string;
    postCtaTelegramDurationInMs?: number;
    postCtaDiscord?: string;
    postCtaDiscordDurationInMs?: number;
    postCtaSlack?: string;
    postCtaSlackDurationInMs?: number;
    emailVerifyMessage?: string;
    discordVerifiedMessage?: string;
    discordVerifiedPromptTooltip?: string;
  };
  parentComponent?: 'inbox' | 'ftu';
};

export const TargetList: React.FC<TargetListProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const {
    targetDocument: { targetInfoPrompts, targetData },
    isLoading: isLoadingTarget,
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
          targetListItemArgs.postCta = {
            type: 'text',
            text:
              props.copy?.postCtaEmail ?? defaultCopy.targetList.postCtaEmail,
            durationInMs:
              props.copy?.postCtaEmailDurationInMs ??
              defaultCopy.targetList.postCtaEmailDurationInMs,
          };
          break;
        case 'phoneNumber':
          targetListItemArgs.iconType = 'sms';
          targetListItemArgs.label =
            props.copy?.sms ?? defaultCopy.targetList.phoneNumber;
          targetListItemArgs.targetCtaType = 'button';
          targetListItemArgs.postCta = {
            //NOTE: SMS target will never go through a post CTA
            type: 'text',
            text: '',
            durationInMs: 0,
          };
          break;
        case 'telegram':
          targetListItemArgs.iconType = 'telegram';
          targetListItemArgs.label =
            props.copy?.telegram ?? defaultCopy.targetList.telegram;
          targetListItemArgs.targetCtaType = 'button';
          targetListItemArgs.postCta = {
            type: 'text',
            text:
              props.copy?.postCtaTelegram ??
              defaultCopy.targetList.postCtaTelegram,
            durationInMs: 5000,
          };
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
          targetListItemArgs.postCta = {
            type: 'text',
            text:
              props.copy?.postCtaDiscord ??
              defaultCopy.targetList.postCtaDiscord,
            durationInMs:
              props.copy?.postCtaDiscordDurationInMs ??
              defaultCopy.targetList.postCtaDiscordDurationInMs,
          };
          break;
        case 'slack':
          if (!targetData[target].useSlack) return null;
          targetListItemArgs.iconType = 'slack';
          targetListItemArgs.label = defaultCopy.targetList.slack;
          targetListItemArgs.targetCtaType = 'button';
          targetListItemArgs.postCta = {
            type: 'text',
            text:
              props.copy?.postCtaSlack ?? defaultCopy.targetList.postCtaSlack,
            durationInMs:
              props.copy?.postCtaSlackDurationInMs ??
              defaultCopy.targetList.postCtaSlackDurationInMs,
          };
          break;
        case 'wallet':
          if (!targetData[target].useWallet) return null;
          targetListItemArgs.iconType = 'connect';
          targetListItemArgs.label = defaultCopy.targetList.wallet;
          targetListItemArgs.targetCtaType = 'button';
          targetListItemArgs.message = {
            beforeVerify: defaultCopy.targetList.walletVerifyMessage,
            beforeVerifyTooltip: defaultCopy.targetList.walletVerifyTooltip,
            afterVerify: defaultCopy.targetList.walletVerifiedMessage,
            afterVerifyTooltip: defaultCopy.targetList.walletVerifiedTooltip,
            afterVerifyTooltipEndingLink:
              defaultCopy.targetList.walletVerifiedTooltipLink,
          };
          targetListItemArgs.postCta = {
            type: 'loading-animation',
            animationType: 'spinner',
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
