import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import { useDestinationState } from 'notifi-react-card/lib/hooks/useDestinationState';
import React from 'react';

import { DeepPartialReadonly } from '../../../utils';
import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../../NotifiAlertBox';
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
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    AlertsPanel?: DeepPartialReadonly<AlertsPanelProps['classNames']>;
    backArrowContainer?: string;
    UserInfoPanel?: DeepPartialReadonly<UserInfoPanelProps['classNames']>;
    NotifiPreviewCardTitle?: string;
    NotifiPreviewCardDividerLine?: string;
    dividerLine?: string;
    signupBanner?: SignupBannerProps['classNames'];
  };
  copy?: {
    alertRowsHeader?: string;
  };
  data: CardConfigItemV1;
  inputDisabled: boolean;
  inputs: Record<string, unknown>;
  headerRightIcon?: NotifiAlertBoxButtonProps;
}>;

export const PreviewCard: React.FC<PreviewCardProps> = ({
  classNames,
  data,
  inputDisabled,
  inputs = {},
  headerRightIcon,
  copy,
}) => {
  const { isTargetsExist } = useDestinationState();
  const { setCardView } = useNotifiSubscriptionContext();
  return (
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        leftIcon={{
          name: 'back',
          onClick: () => setCardView({ state: 'history' }),
        }}
        rightIcon={headerRightIcon}
      >
        <h2>
          {(data.titles?.active && data.titles.previewView) || 'Manage Alerts'}
        </h2>
      </NotifiAlertBox>
      <div className={clsx('DividerLine preview', classNames?.dividerLine)} />

      {!isTargetsExist ? (
        <SignupBanner data={data} classNames={classNames?.signupBanner} />
      ) : null}
      <div
        data-cy="previewCard"
        className={clsx(
          'NotifiPreviewCard__container',
          classNames?.NotifiPreviewCardContainer,
        )}
      >
        {isTargetsExist ? (
          <UserInfoPanel
            classNames={classNames?.UserInfoPanel}
            contactInfo={data.contactInfo}
          />
        ) : null}

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
          {copy?.alertRowsHeader ?? 'Select the alerts you want to receive:'}
        </div>
        <AlertsPanel
          classNames={classNames?.AlertsPanel}
          data={data}
          inputDisabled={inputDisabled}
          inputs={inputs}
        />
      </div>
    </>
  );
};
