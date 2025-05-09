import clsx from 'clsx';
import React from 'react';

import {
  FtuStage,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiUserSettingContext,
} from '../context';
import { hasValidTargetMoreThan } from '../utils';
import { defaultCopy } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader, NavHeaderProps, NavHeaderRightCta } from './NavHeader';
import { TargetList } from './TargetList';

export type FtuTargetListProps = {
  onClickNext: () => void;
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    buttonContainer?: string;
    NavHeader?: NavHeaderProps['classNames'];
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  navHeaderRightCta?: NavHeaderRightCta;
};

export const FtuTargetList: React.FC<FtuTargetListProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { updateFtuStage } = useNotifiUserSettingContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const {
    targetDocument: { targetData },
  } = useNotifiTargetContext();

  const onClick = async () => {
    setIsLoading(true);
    await updateFtuStage(FtuStage.Alerts);
    props.onClickNext();
    setIsLoading(false);
  };

  const isTargetListValid = cardConfig?.isContactInfoRequired
    ? hasValidTargetMoreThan(targetData, 0)
    : true;

  return (
    <div
      className={clsx('notifi-ftu-target-list', props.classNames?.container)}
    >
      <NavHeader
        rightCta={props.navHeaderRightCta}
        classNames={
          props.classNames?.NavHeader ?? {
            container: 'notifi-ftu-target-list-header',
          }
        }
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuTargetList.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-ftu-target-list-main', props.classNames?.main)}
      >
        <TargetList />
      </div>
      <div
        className={clsx(
          'notifi-ftu-button-container',
          props.classNames?.buttonContainer,
        )}
      >
        <button
          data-cy="notifi-ftu-target-list-button"
          className={clsx(
            'btn',
            'notifi-ftu-target-list-button',
            props.classNames?.button,
          )}
          disabled={isLoading || !isTargetListValid}
          onClick={onClick}
        >
          {isLoading ? (
            <LoadingAnimation
              type="spinner"
              classNames={{ spinner: 'notifi-ftu-target-list-button-spinner' }}
            />
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
    </div>
  );
};
