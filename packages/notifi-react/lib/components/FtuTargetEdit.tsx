import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { useIsTargetInputValid } from '../hooks/useIsTargetInputValid';
import { defaultCopy } from '../utils/constants';
import { FtuView } from './Ftu';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader, NavHeaderRightCta } from './NavHeader';
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
    invalidEmailWarning?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    main?: string;
    buttonContainer?: string;
    TargetInputs?: TargetInputsProps['classNames'];
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
  navHeaderRightCta?: NavHeaderRightCta;
};

export const FtuTargetEdit: React.FC<FtuTargetEditProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    renewTargetGroup,
    targetDocument: { targetInputs },
  } = useNotifiTargetContext();
  const [isShowingInvalidEmailWarning, setIsShowingInvalidEmailWarning] =
    React.useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await renewTargetGroup();
    props.setFtuView(FtuView.TargetList);
    setIsLoading(false);
  };

  const isInputValid = useIsTargetInputValid();

  return (
    <div
      className={clsx('notifi-ftu-target-edit', props.classNames?.container)}
    >
      <NavHeader rightCta={props.navHeaderRightCta}>
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
      <div
        className={clsx(
          'notifi-ftu-target-edit-invalid-email-warning',
          props.classNames?.invalidEmailWarning,
        )}
      >
        {isShowingInvalidEmailWarning ? targetInputs.email.error : null}
      </div>

      <div
        className={clsx('notifi-ftu-target-edit-main', props.classNames?.main)}
      >
        <TargetInputs
          copy={props.copy?.TargetInputs}
          formTargetsOnFocus={(target) => {
            if (target === 'email') setIsShowingInvalidEmailWarning(false);
          }}
          formTargetsOnBlur={(target) => {
            if (target === 'email') setIsShowingInvalidEmailWarning(true);
          }}
        />
      </div>
      <div
        className={clsx(
          'notifi-ftu-button-container',
          props.classNames?.buttonContainer,
        )}
      >
        <button
          data-cy="notifi-ftu-target-edit-button"
          className={clsx(
            'btn',
            'notifi-ftu-target-edit-button',
            props.classNames?.button,
          )}
          disabled={!isInputValid || isLoading}
          onClick={onClick}
        >
          {isLoading ? (
            <LoadingAnimation
              type="spinner"
              classNames={{ spinner: 'notifi-ftu-target-edit-button-spinner' }}
            />
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
    </div>
  );
};
