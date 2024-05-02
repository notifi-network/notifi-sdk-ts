import { objectKeys } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { TargetInputFromValue, useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { ErrorGlobal } from './ErrorGlobal';
import { FtuView } from './Ftu';
import { LoadingGlobal } from './LoadingGlobal';
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
    TargetInputs?: TargetInputsProps['classNames'];
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuTargetEdit: React.FC<FtuTargetEditProps> = (props) => {
  const {
    renewTargetGroup,
    targetDocument: { targetInputs },
    isChangingTargets,
    isLoading: isLoadingTargets,
    error: targetError,
  } = useNotifiTargetContext();
  const isTargetInputChanged = Object.values(isChangingTargets).includes(true);

  if (isLoadingTargets) {
    return <LoadingGlobal />;
  }

  if (targetError) {
    return <ErrorGlobal />;
  }
  const isInputValid = React.useMemo(() => {
    return !objectKeys(targetInputs)
      .map((key) => {
        if (typeof targetInputs[key] !== 'boolean') {
          const targetInput = targetInputs[key] as TargetInputFromValue;
          if (targetInput.error) {
            return false;
          }
        }
        return true;
      })
      .includes(false);
  }, [targetInputs]);

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
        disabled={!isTargetInputChanged || !isInputValid}
        onClick={async () => {
          await renewTargetGroup();
          props.setFtuView(FtuView.TargetList);
        }}
      >
        <div>
          {props.copy?.buttonText ?? defaultCopy.ftuTargetEdit.buttonText}
        </div>
      </button>
    </div>
  );
};
