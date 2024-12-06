import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { defaultCopy, hasTarget } from '../utils';
import { InboxView } from './Inbox';
import { NavHeader, NavHeaderRightCta } from './NavHeader';
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
  navHeaderRightCta?: NavHeaderRightCta;
};

export const InboxConfigTargetList: React.FC<InboxConfigTargetListProps> = (
  props,
) => {
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
        rightCta={props.navHeaderRightCta}
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
      {/* <button
        data-cy="notifi-inbox-config-target-list-button"
        className={clsx(
          'btn',
          'notifi-inbox-config-target-list-button',
          props.classNames?.button,
        )}
        disabled={isLoading}
        onClick={() => props.setInboxView(InboxView.InboxConfigTargetEdit)}
      >
        <div className={clsx('notifi-inbox-config-target-list-button-text')}>
          {props.copy?.buttonText ??
            defaultCopy.inboxConfigTargetList.buttonText}
        </div>
      </button> */}
    </div>
  );
};
