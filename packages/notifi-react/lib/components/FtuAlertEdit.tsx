import clsx from 'clsx';
import React from 'react';

import { FtuStage, useNotifiUserSettingContext } from '../context';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';
import { TopicList } from './TopicList';

export type FtuAlertEditProps = {
  onClickNext: () => void;
  onClickBack?: () => void;
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    buttonContainer?: string;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  // setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuAlertEdit: React.FC<FtuAlertEditProps> = (props) => {
  const { updateFtuStage } = useNotifiUserSettingContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;

  const onClick = async () => {
    setIsLoading(true);
    await updateFtuStage(FtuStage.Done);
    setIsLoading(false);
    props.onClickNext();
  };

  return (
    <div className={clsx('notifi-ftu-alert-edit', props.classNames?.container)}>
      <NavHeader
        leftCta={
          props.onClickBack
            ? {
                icon: 'arrow-back',
                action: () => props.onClickBack!(),
              }
            : undefined
        }
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuAlertEdit.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-ftu-alert-edit-main', props.classNames?.main)}
      >
        <TopicList />
      </div>
      <div
        className={clsx(
          'notifi-ftu-button-container',
          props.classNames?.buttonContainer,
        )}
      >
        <button
          className={clsx(
            'notifi-ftu-alert-edit-button',
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
              'notifi-ftu-alert-edit-button-text',
              isLoading && 'hidden',
            )}
          >
            {props.copy?.buttonText ?? defaultCopy.ftuAlertEdit.buttonText}
          </div>
        </button>
      </div>
    </div>
  );
};
