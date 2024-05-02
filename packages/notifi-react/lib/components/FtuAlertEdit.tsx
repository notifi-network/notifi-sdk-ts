import clsx from 'clsx';
import React from 'react';

import { FtuStage, useNotifiUserSettingContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { FtuView } from './Ftu';
import { NavHeader } from './NavHeader';
import { TopicList } from './TopicList';

export type FtuAlertEditProps = {
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  setFtuView: React.Dispatch<React.SetStateAction<FtuView | null>>;
};

export const FtuAlertEdit: React.FC<FtuAlertEditProps> = (props) => {
  const { updateFtuStage } = useNotifiUserSettingContext();
  return (
    <div className={clsx('notifi-ftu-alert-edit', props.classNames?.container)}>
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setFtuView(FtuView.TargetList),
        }}
      >
        {props.copy?.headerTitle ?? defaultCopy.ftuAlertEdit.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-ftu-alert-edit-main', props.classNames?.main)}
      >
        <TopicList />
      </div>

      <button
        className={clsx(
          'notifi-ftu-alert-edit-button',
          props.classNames?.button,
        )}
        onClick={async () => updateFtuStage(FtuStage.Done)}
      >
        <div>
          {props.copy?.buttonText ?? defaultCopy.ftuAlertEdit.buttonText}
        </div>
      </button>
    </div>
  );
};
