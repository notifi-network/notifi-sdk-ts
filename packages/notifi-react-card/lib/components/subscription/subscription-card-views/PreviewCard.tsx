import clsx from 'clsx';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
import { DeepPartialReadonly } from '../../../utils';
import { PreviewCardClassNamesProps } from '../SubscriptionCardV1';
import { AlertsPanel } from './preview-panel/AlertsPanel';
import {
  UserInfoPanel,
  UserInfoPanelProps,
} from './preview-panel/UserInfoPanel';

export type PreviewCardProps = Readonly<{
  classNames?: PreviewCardClassNamesProps &
    DeepPartialReadonly<UserInfoPanelProps>;
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
  return (
    <div className={clsx('NotifiPreviewCard__container')}>
      <UserInfoPanel data={data} />
      <div
        className={clsx(
          'NotifiPreviewCardSeparator',
          classNames?.NotifiPreviewCardSeparator,
        )}
      />
      <AlertsPanel
        classNames={classNames}
        data={data}
        inputDisabled={inputDisabled}
        inputs={inputs}
      />
    </div>
  );
};
