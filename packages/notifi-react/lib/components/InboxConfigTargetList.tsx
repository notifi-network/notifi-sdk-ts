import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils';
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
    targetDocument: { targetData },
  } = useNotifiTargetContext();

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
    </div>
  );
};
