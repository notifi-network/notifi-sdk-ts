import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { useIsTargetInputValid } from '../hooks/useIsTargetInputValid';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils/constants';
import { ErrorGlobal } from './ErrorGlobal';
import { FtuView } from './Ftu';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';
import { TargetInputs, TargetInputsProps } from './TargetInputs';

export type FtuTargetEditProps = {
  copy?: {
    description?: string;
    TargetInputs?: TargetInputsProps['copy'];
    headerTitle?: string;
    buttonText?: string;
  };
  classNames?: {
    container?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    TargetInputs?: TargetInputsProps['classNames'];
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuTargetEdit: React.FC<FtuTargetEditProps> = (props) => {
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    renewTargetGroup,
    isChangingTargets,
    error: targetError,
  } = useNotifiTargetContext();
  const isTargetInputChanged = Object.values(isChangingTargets).includes(true);

  const onClick = async () => {
    setIsLoading(true);
    await renewTargetGroup();
    props.setFtuView(FtuView.TargetList);
    setIsLoading(false);
  };

  if (targetError) {
    return <ErrorGlobal />;
  }
  const isInputValid = useIsTargetInputValid();

  return (
    <div
      className={clsx('notifi-ftu-target-edit', props.classNames?.container)}
    >
      <NavHeader>
        {props.copy?.headerTitle ?? defaultCopy.ftuTargetEdit.headerTitle}
      </NavHeader>
      <div
        className={clsx(
          'notifi-ftu-target-edit-description',
          props.classNames?.TargetInputs,
        )}
      >
        {props.copy?.description ?? defaultCopy.ftuTargetEdit.description}
      </div>
      <TargetInputs copy={props.copy?.TargetInputs} />
      <button
        className={clsx(
          'notifi-ftu-target-edit-button',
          props.classNames?.button,
        )}
        disabled={!isTargetInputChanged || !isInputValid || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
        ) : null}
        <div
          className={clsx(
            'notifi-ftu-target-edit-button-text',
            isLoading && 'hidden',
          )}
        >
          {props.copy?.buttonText ?? defaultCopy.ftuTargetEdit.buttonText}
        </div>
      </button>
    </div>
  );
};
