import clsx from 'clsx';
import React from 'react';

import { defaultCopy } from '../utils/constants';
import { FtuView } from './Ftu';
import { NavHeader } from './NavHeader';
import { TargetList } from './TargetList';

type FtuTargetListProps = {
  classNames?: {
    container?: string;
    button?: string;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuTargetList: React.FC<FtuTargetListProps> = (props) => {
  return (
    <div
      className={clsx('notifi-ftu-target-list', props.classNames?.container)}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setFtuView(FtuView.TargetEdit),
        }}
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuTargetList.headerTitle}
      </NavHeader>
      <TargetList />
      <button
        className={clsx(
          'notifi-ftu-target-list-button',
          props.classNames?.button,
        )}
        onClick={async () => {
          props.setFtuView(FtuView.AlertEdit);
        }}
      >
        <div>
          {props.copy?.buttonText ?? defaultCopy.ftuTargetList.buttonText}
        </div>
      </button>
    </div>
  );
};
