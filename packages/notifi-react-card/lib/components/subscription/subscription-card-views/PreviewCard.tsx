import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import { useIsTargetsExist } from 'notifi-react-card/lib/hooks/useIsTargetsExist';
import React, { useMemo } from 'react';

import { DeepPartialReadonly } from '../../../utils';
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
  const isTargetsExist = useIsTargetsExist();
  return (
    <div
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
