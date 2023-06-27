import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React, { useMemo } from 'react';

import { DeepPartialReadonly } from '../../../utils';
import { SignupBanner, SignupBannerProps } from '../../SignupBanner';
import { AlertsPanel, AlertsPanelProps } from './preview-panel/AlertsPanel';
import {
  UserInfoPanel,
  UserInfoPanelProps,
} from './preview-panel/UserInfoPanel';

export type PreviewCardProps = Readonly<{
  classNames?: {
    NotifiPreviewCardSeparator?: string;
    NotifiPreviewCardContainer?: string;
    AlertsPanel?: DeepPartialReadonly<AlertsPanelProps['classNames']>;
    backArrowContainer?: string;
    UserInfoPanel?: DeepPartialReadonly<UserInfoPanelProps['classNames']>;
    NotifiPreviewCardTitle?: string;
    NotifiPreviewCardDividerLine?: string;
    signupBanner?: SignupBannerProps['classNames']; // TODO: Move up one level (for MVP-2733), Blocker: MVP-2716
  };
  data: CardConfigItemV1;
  inputDisabled: boolean;
  inputs: Record<string, unknown>;
}>;

export const PreviewCard: React.FC<PreviewCardProps> = ({
  classNames,
  data,
  inputDisabled,
  inputs = {},
}) => {
  const { useDiscord, email, phoneNumber, telegramId, discordTargetData } =
    useNotifiSubscriptionContext();

  const isTargetsExist = useMemo(() => {
    return (
      !!email ||
      !!phoneNumber ||
      !!telegramId ||
      (useDiscord &&
        !!discordTargetData?.id &&
        !!discordTargetData?.discordAccountId)
    );
  }, [
    email,
    phoneNumber,
    telegramId,
    discordTargetData?.id,
    discordTargetData?.discordAccountId,
  ]);
  return (
    <div
      className={clsx(
        'NotifiPreviewCard__container',
        classNames?.NotifiPreviewCardContainer,
      )}
    >
      {!isTargetsExist ? (
        <SignupBanner data={data} classNames={classNames?.signupBanner} /> //TODO: Move up one level (for MVP-2733), Blocker: MVP-2716
      ) : (
        <UserInfoPanel
          classNames={classNames?.UserInfoPanel}
          contactInfo={data.contactInfo}
        />
      )}

      <div
        className={clsx(
          'NotifiPreviewCard__dividerLine',
          classNames?.NotifiPreviewCardDividerLine,
        )}
      />

      <div
        className={clsx(
          'NotifiPreviewCard__title',
          classNames?.NotifiPreviewCardTitle,
        )}
      >
        Select the alerts you want to receive:
      </div>
      <AlertsPanel
        classNames={classNames?.AlertsPanel}
        data={data}
        inputDisabled={inputDisabled}
        inputs={inputs}
      />
    </div>
  );
};
