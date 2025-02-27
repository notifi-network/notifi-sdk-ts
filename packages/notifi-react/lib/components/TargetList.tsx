import { objectKeys } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  NotifiTenantConfigContextType,
  Target,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
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
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();

  const targetListItemArgsList = React.useMemo(() => {
    const order = [
      'email',
      'phoneNumber',
      'telegram',
      'discord',
      'slack',
      'wallet',
    ];

    return objectKeys(targetData)
      .sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      })
      .map((target) => {
        const targetInfo = targetInfoPrompts[target];
        const targetListItemArgs = {
          target,
          targetInfo,
        } as TargetListItemProps;

        if (!cardConfig?.contactInfo[targetToContactInfoKey(target)]?.active)
          return null;

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
            targetListItemArgs.targetCtaType = 'link';
            break;
          case 'discord':
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
            targetListItemArgs.iconType = 'slack';
            targetListItemArgs.label = defaultCopy.targetList.slack;
            targetListItemArgs.targetCtaType = 'button';
            break;
          case 'wallet':
            targetListItemArgs.iconType = 'connect';
            targetListItemArgs.label = defaultCopy.targetList.wallet;
            targetListItemArgs.targetCtaType = 'button';
            targetListItemArgs.message = {
              beforeSignup: !targetData.wallet.isAvailable
                ? 'Only available for Coinbase Wallet'
                : undefined,
              beforeVerify: defaultCopy.targetList.walletVerifyMessage,
              beforeVerifyTooltip: defaultCopy.targetList.walletVerifyTooltip,
              afterVerify: defaultCopy.targetList.walletVerifiedMessage,
              afterVerifyTooltip: defaultCopy.targetList.walletVerifiedTooltip,
              afterVerifyTooltipEndingLink:
                defaultCopy.targetList.walletVerifiedTooltipLink,
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

// Utils
type ContactInfoKey = keyof NonNullable<
  NotifiTenantConfigContextType['cardConfig']
>['contactInfo'];

const targetToContactInfoKey = (target: Target): ContactInfoKey => {
  if (target === 'phoneNumber') return 'sms';
  return target;
};
