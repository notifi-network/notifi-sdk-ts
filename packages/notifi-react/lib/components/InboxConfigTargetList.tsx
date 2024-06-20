import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { defaultCopy, defaultLoadingAnimationStyle, hasTarget } from '../utils';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';
import { TargetList } from './TargetList';

export type InboxConfigTargetListProps = {
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
  };
  copy?: {
    header?: string;
    buttonText?: string;
  };
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
};

export const InboxConfigTargetList: React.FC<InboxConfigTargetListProps> = (
  props,
) => {
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  const {
    isLoading,
    targetDocument: { targetData },
  } = useNotifiTargetContext();

  if (!hasTarget(targetData)) {
    props.setInboxView(InboxView.InboxConfigTopic);
  }

  return (
    <div
      className={clsx(
        'notifi-inbox-config-target-list',
        props.classNames?.container,
      )}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setInboxView(InboxView.InboxConfigTopic),
        }}
      >
        {props.copy?.header ?? defaultCopy.inboxConfigTargetList.header}
      </NavHeader>
      <div
        className={clsx(
          'notifi-inbox-config-target-list-main',
          props.classNames?.main,
        )}
      >
        <TargetList
          classNames={{
            TargetListItem: {
              targetListVerifiedItem: 'notifi-inbox-config-target-list-item',
            },
          }}
          parentComponent="inbox"
        />
      </div>
      <button
        className={clsx(
          'notifi-inbox-config-target-list-button',
          props.classNames?.button,
        )}
        disabled={isLoading}
        onClick={() => props.setInboxView(InboxView.InboxConfigTargetEdit)}
      >
        {isLoading ? (
          <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
        ) : null}
        <div
          className={clsx(
            'notifi-inbox-config-target-list-button-text',
            isLoading && 'hidden',
          )}
        >
          {props.copy?.buttonText ??
            defaultCopy.inboxConfigTargetList.buttonText}
        </div>
      </button>
    </div>
  );
};
