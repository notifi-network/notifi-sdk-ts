import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { useIsTargetInputValid } from '../hooks/useIsTargetInputValid';
import { defaultCopy, hasTarget } from '../utils';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader, NavHeaderRightCta } from './NavHeader';
import { TargetInputs, TargetInputsProps } from './TargetInputs';

export type InboxConfigTargetEditProps = {
  classNames?: {
    container?: string;
    main?: string;
    invalidEmailWarning?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    TargetInputs?: TargetInputsProps['classNames'];
  };
  copy?: {
    header?: string;
    description?: string;
    buttonTextHasTarget?: string;
    buttonTextNoTarget?: string;
    TargetInputs?: TargetInputsProps['copy'];
  };
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  navHeaderRightCta?: NavHeaderRightCta;
};

export const InboxConfigTargetEdit: React.FC<InboxConfigTargetEditProps> = (
  props,
) => {
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    isChangingTargets,
  } = useNotifiTargetContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const isUpdated = React.useRef(false);

  const isTargetInputChanged = Object.values(isChangingTargets).includes(true);
  const [isShowingInvalidEmailWarning, setIsShowingInvalidEmailWarning] =
    React.useState(false);

  React.useEffect(() => {
    if (!isUpdated.current) return;
    setIsLoading;
    if (hasTarget(targetData)) {
      return props.setInboxView(InboxView.InboxConfigTargetList);
    }
    props.setInboxView(InboxView.InboxConfigTopic);
    isUpdated.current = false;
  }, [targetData]);

  const isInputValid = useIsTargetInputValid();

  const onClick = async () => {
    setIsLoading(true);
    await renewTargetGroup();
    isUpdated.current = true;
  };
  return (
    <div
      className={clsx(
        'notifi-inbox-config-target-edit',
        props.classNames?.container,
      )}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setInboxView(InboxView.InboxConfigTargetList),
        }}
        rightCta={props.navHeaderRightCta}
      >
        {props.copy?.header ?? defaultCopy.inboxConfigTargetEdit.header}
      </NavHeader>
      <div
        className={clsx(
          'notifi-inboxConfig-target-edit-description',
          props.classNames?.TargetInputs,
        )}
      >
        {props.copy?.description ?? defaultCopy.ftuTargetEdit.description}
      </div>
      <div
        className={clsx(
          'notifi-inbox-config-target-edit-invalid-email-warning',
          props.classNames?.invalidEmailWarning,
        )}
      >
        {isShowingInvalidEmailWarning ? targetInputs.email.error : null}
      </div>
      <div
        className={clsx(
          'notifi-inbox-config-target-edit-main',
          props.classNames?.main,
        )}
      >
        <TargetInputs
          classNames={props.classNames?.TargetInputs}
          copy={props.copy?.TargetInputs}
          formTargetsOnFocus={(target) => {
            if (target === 'email') setIsShowingInvalidEmailWarning(false);
          }}
          formTargetsOnBlur={(target) => {
            if (target === 'email') setIsShowingInvalidEmailWarning(true);
          }}
        />
      </div>
      <button
        className={clsx(
          'btn',
          'notifi-inbox-config-target-edit-button',
          props.classNames?.button,
        )}
        disabled={isLoading || !isTargetInputChanged || !isInputValid}
        onClick={onClick}
      >
        {isLoading ? (
          <LoadingAnimation
            type="spinner"
            classNames={{
              spinner: 'notifi-inbox-config-target-edit-button-spinner',
            }}
          />
        ) : null}
        <div
          className={clsx(
            'notifi-inbox-config-target-edit-button-text',
            isLoading && 'hidden',
          )}
        >
          {hasTarget(targetData)
            ? props.copy?.buttonTextHasTarget ??
              defaultCopy.inboxConfigTargetEdit.buttonTextHasTarget
            : props.copy?.buttonTextNoTarget ??
              defaultCopy.inboxConfigTargetEdit.buttonTextNoTarget}
        </div>
      </button>
    </div>
  );
};
