import clsx from 'clsx';
import React from 'react';

import { FtuStage, useNotifiUserSettingContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader, NavHeaderRightCta } from './NavHeader';
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
  navHeaderRightCta?: NavHeaderRightCta;
};

export const FtuAlertEdit: React.FC<FtuAlertEditProps> = (props) => {
  const { updateFtuStage } = useNotifiUserSettingContext();
  const [isLoading, setIsLoading] = React.useState(false);

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
        rightCta={props.navHeaderRightCta}
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuAlertEdit.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-ftu-alert-edit-main', props.classNames?.main)}
      >
        <TopicList parentComponent="ftu" />
      </div>
      <div
        className={clsx(
          'notifi-ftu-button-container',
          props.classNames?.buttonContainer,
        )}
      >
        <button
          data-cy="notifi-ftu-alert-edit-button"
          className={clsx(
            'btn',
            'notifi-ftu-alert-edit-button',
            props.classNames?.button,
          )}
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <LoadingAnimation
              type="spinner"
              classNames={{ spinner: 'notifi-ftu-alert-edit-button-spinner' }}
            />
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
