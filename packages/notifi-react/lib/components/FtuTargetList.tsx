import clsx from 'clsx';
import React from 'react';

import { FtuStage, useNotifiUserSettingContext } from '../context';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils/constants';
import { FtuView } from './Ftu';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';
import { TargetList } from './TargetList';

export type FtuTargetListProps = {
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuTargetList: React.FC<FtuTargetListProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { updateFtuStage } = useNotifiUserSettingContext();

  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;

  const onClick = async () => {
    setIsLoading(true);
    await updateFtuStage(FtuStage.Alerts);
    props.setFtuView(FtuView.AlertEdit);
    setIsLoading(false);
  };

  return (
    <div
      className={clsx('notifi-ftu-target-list', props.classNames?.container)}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setFtuView(FtuView.TargetEdit),
        }}
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuTargetList.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-ftu-target-list-main', props.classNames?.main)}
      >
        <TargetList />
      </div>

      <button
        className={clsx(
          'notifi-ftu-target-list-button',
          props.classNames?.button,
        )}
        disabled={isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
        ) : null}
        <div
          className={clsx(
            'notifi-ftu-target-list-button-text',
            isLoading && 'hidden',
          )}
        >
          {props.copy?.buttonText ?? defaultCopy.ftuTargetList.buttonText}
        </div>
      </button>
    </div>
  );
};
