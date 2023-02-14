import clsx from 'clsx';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
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
  return (
    <div
      className={clsx(
        'NotifiPreviewCard__container',
        classNames?.NotifiPreviewCardContainer,
      )}
    >
      <UserInfoPanel
        classNames={classNames?.UserInfoPanel}
        contactInfo={data.contactInfo}
      />
      <AlertsPanel
        classNames={classNames?.AlertsPanel}
        data={data}
        inputDisabled={inputDisabled}
        inputs={inputs}
      />
    </div>
  );
};
