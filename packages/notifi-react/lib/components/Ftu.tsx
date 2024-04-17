import clsx from 'clsx';
import React from 'react';

import {
  FtuStage,
  useNotifiTargetContext,
  useNotifiUserSettingContext,
} from '../context';
import { FtuAlertList, FtuAlertListProps } from './FtuAlertList';
import { FtuTargetEdit, FtuTargetEditProps } from './FtuTargetEdit';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';

export enum FtuView {
  AlertList = 'alertList',
  TargetEdit = 'edit',
  TargetList = 'list',
  AlertEdit = 'alertEdit',
}

export type FtuProps = {
  copy?: {
    FtuAlertList?: FtuAlertListProps['copy'];
    FtuTargetEdit?: FtuTargetEditProps['copy'];
  };
  classNames?: {
    container?: string;
    footer?: string;
    FtuAlertList?: FtuAlertListProps['classNames'];
    FtuTargetEdit?: FtuTargetEditProps['classNames'];
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
  };
};

export const Ftu: React.FC<FtuProps> = (props) => {
  console.log({ props, ftu: 'FTUSTAGE' });
  // TODO: Move to hook
  const { ftuStage } = useNotifiUserSettingContext();
  const {
    targetDocument: { targetData },
  } = useNotifiTargetContext();
  const [ftuView, setFtuView] = React.useState<FtuView | null>(null);

  const isTargetExist = React.useMemo(
    () =>
      Object.values(targetData)
        .map((target) => {
          if (typeof target === 'string') {
            return !!target;
          }
          if ('useSlack' in target) {
            return target.useSlack;
          }
          if ('useDiscord' in target) {
            return target.useDiscord;
          }
          return false;
        })
        .includes(true),
    [targetData],
  );

  React.useEffect(() => {
    if (ftuStage === null) {
      setFtuView(FtuView.AlertList);
      return;
    }
    if (ftuStage === FtuStage.Destination && !isTargetExist) {
      setFtuView(FtuView.TargetEdit);
      return;
    }
    if (ftuStage === FtuStage.Destination && isTargetExist) {
      setFtuView(FtuView.TargetList);
      return;
    }
    setFtuView(FtuView.AlertEdit);
    return;
  }, [ftuStage, isTargetExist]);

  if (!ftuView) return null;

  return (
    <div className={clsx('notifi-ftu', props.classNames?.container)}>
      {ftuView === FtuView.AlertEdit ? (
        <FtuAlertList
          copy={props.copy?.FtuAlertList}
          classNames={props.classNames?.FtuAlertList}
        />
      ) : null}
      {ftuView === FtuView.TargetEdit ? (
        <FtuTargetEdit
          setFtuView={setFtuView}
          copy={props.copy?.FtuTargetEdit}
          classNames={props.classNames?.FtuTargetEdit}
        />
      ) : null}
      {ftuView === FtuView.TargetList ? <div>FtuTargetList</div> : null}
      {ftuView === FtuView.AlertEdit ? <div>FtuAlertEdit</div> : null}
      <div className={clsx('notifi-ftu-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
