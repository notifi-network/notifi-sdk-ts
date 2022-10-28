import clsx from 'clsx';
import React, { useCallback } from 'react';

import { BackArrow } from '../../../assets/backArrow';
import { useNotifiSubscriptionContext } from '../../../context';
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
  inputs: Record<string, string | undefined>;
}>;

export const PreviewCard: React.FC<PreviewCardProps> = ({
  classNames,
  data,
  inputDisabled,
  inputs = {},
}) => {
  const { setCardView } = useNotifiSubscriptionContext();

  const handlePreviewClick = useCallback(() => {
    setCardView({ state: 'history' });
  }, [setCardView]);
  return (
    <div
      className={clsx(
        'NotifiPreviewCard__container',
        classNames?.NotifiPreviewCardContainer,
      )}
    >
      <div
        className={clsx(
          'NotifiPreviewCard__backArrowContainer',
          classNames?.backArrowContainer,
        )}
        onClick={() => handlePreviewClick()}
      >
        <BackArrow />
      </div>
      <UserInfoPanel classNames={classNames?.UserInfoPanel} data={data} />
      <div
        className={clsx(
          'NotifiPreviewCardSeparator',
          classNames?.NotifiPreviewCardSeparator,
        )}
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
