import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { objectKeys } from '@notifi-network/notifi-frontend-client';
import {
  NotifiTenantConfigContextType,
  Target,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
import React, { useState } from 'react';

import { CoinbaseInfoModal } from './CoinbaseInfoModal';
import { TargetListItem, TargetListItemProps } from './TargetListItem';

export type TargetListProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  parentComponent?: 'inbox' | 'ftu';
};
export const TargetList: React.FC<TargetListProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';

  const {
    targetDocument: { targetInfoPrompts, targetData },
  } = useNotifiTargetContext();

  const [isCBInfoModalOpen, setIsCBInfoModalOpen] = useState(false);

  const toggleCBInfoModal = () => {
    setIsCBInfoModalOpen(!isCBInfoModalOpen);
  };

  const isSignWalletRequired =
    targetInfoPrompts.wallet?.infoPrompt?.message === 'Sign Wallet';

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

        if (!props.contactInfo[targetToContactInfoKey(target)]?.active)
          return null;

        switch (target) {
          case 'email':
            targetListItemArgs.iconType = 'email-icon';
            targetListItemArgs.label = 'Email';
            targetListItemArgs.targetCtaType = 'link';
            targetListItemArgs.message = {
              beforeVerify: 'Verification email sent',
            };
            break;
          case 'telegram':
            targetListItemArgs.iconType = 'telegram-icon';
            targetListItemArgs.label = 'Telegram';
            targetListItemArgs.targetCtaType = 'link';
            break;
          case 'discord':
            targetListItemArgs.iconType = 'discord-icon';
            targetListItemArgs.label = 'Discord';
            targetListItemArgs.targetCtaType = 'button';
            targetListItemArgs.message = {
              afterVerify: 'Make sure Discord DMs are enabled',
              afterVerifyTooltip:
                'Make sure you have enabled DMs in Discord. Right click on the server after joining, go to Privacy Settings, and enable Direct Messages.',
            };
            break;
          case 'slack':
            targetListItemArgs.iconType = 'slack-icon';
            targetListItemArgs.label = 'Slack';
            targetListItemArgs.targetCtaType = 'button';
            break;
          case 'wallet':
            targetListItemArgs.iconType = 'wallet-icon';
            targetListItemArgs.label = 'Wallet';
            targetListItemArgs.targetCtaType = 'button';
            targetListItemArgs.message = {
              beforeSignup: !targetData.wallet.isAvailable
                ? 'Only available for Coinbase Wallet'
                : undefined,
              beforeVerify: '2-3 signatures required to verify',
              beforeVerifyTooltip:
                'Wallet messages are powered by XMTP and delivered natively into Coinbase Wallet. Download the Coinbase Wallet App.',
              afterVerify: 'Enable messages in Coinbase Wallet App',
              afterVerifyTooltip:
                'Make sure messages are enabled in your Coinbase Wallet Mobile App.',
              afterVerifyTooltipEndingLink: {
                text: 'More info',
                url: 'https://docs.notifi.network/docs/target-setup/wallet-integration',
              },
            };
            break;
        }
        return targetListItemArgs;
      });
  }, [targetData, targetInfoPrompts]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <CoinbaseInfoModal
        handleClose={toggleCBInfoModal}
        open={isCBInfoModalOpen}
      />

      {targetListItemArgsList.map((targetListItemArgs) => {
        if (!targetListItemArgs) return null;
        return (
          <TargetListItem
            key={targetListItemArgs.target}
            {...targetListItemArgs}
            parentComponent={parentComponent}
          />
        );
      })}
    </div>
  );
};

type ContactInfoKey = keyof NonNullable<
  NotifiTenantConfigContextType['cardConfig']
>['contactInfo'];

const targetToContactInfoKey = (target: Target): ContactInfoKey => {
  if (target === 'phoneNumber') return 'sms';
  return target;
};
