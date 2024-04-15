import clsx from 'clsx';
import React from 'react';

import { FtuStage, useNotifiUserSettingContext } from '../context';
import { FtuAlertList, FtuAlertListProps } from './FtuAlertList';

export type FtuProps = {
  copy?: {
    FtuAlertList: FtuAlertListProps['copy'];
  };
  classNames?: {
    container?: string;
    FtuAlertList?: FtuAlertListProps['classNames'];
  };
};

export const Ftu: React.FC<FtuProps> = (props) => {
  const { ftuStage } = useNotifiUserSettingContext();

  return (
    <div className={clsx('notifi-ftu', props.classNames?.container)}>
      {ftuStage === null ? (
        <FtuAlertList
          copy={props.copy?.FtuAlertList}
          classNames={props.classNames?.FtuAlertList}
        />
      ) : null}
      {ftuStage === FtuStage.Destination ? <div>FtuTargetEdit</div> : null}
      {ftuStage === FtuStage.Alerts ? <div>FtuAlertEdit</div> : null}
    </div>
  );
};
