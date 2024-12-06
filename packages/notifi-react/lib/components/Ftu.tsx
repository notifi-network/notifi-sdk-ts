import clsx from 'clsx';
import React from 'react';

import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiUserSettingContext,
} from '../context';
import { FtuAlertEdit, FtuAlertEditProps } from './FtuAlertEdit';
import { FtuTargetEditProps } from './FtuTargetEdit';
import { FtuTargetList, FtuTargetListProps } from './FtuTargetList';
import { NavHeaderRightCta } from './NavHeader';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';

export enum FtuView {
  TargetList = 'list',
  AlertEdit = 'alertEdit',
}

export type FtuProps = {
  onComplete: () => void;
  copy?: {
    FtuTargetEdit?: FtuTargetEditProps['copy'];
    FtuTargetList?: FtuTargetListProps['copy'];
    FtuAlertEdit?: FtuAlertEditProps['copy'];
  };
  classNames?: {
    container?: string;
    footer?: string;
    ftuViews?: string;
    FtuTargetEdit?: FtuTargetEditProps['classNames'];
    FtuTargetList?: FtuTargetListProps['classNames'];
    FtuAlertEdit?: FtuAlertEditProps['classNames'];
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
  };
  navHeaderRightCta?: NavHeaderRightCta;
};

export const Ftu: React.FC<FtuProps> = (props) => {
  const { ftuStage } = useNotifiUserSettingContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const {
    targetDocument: { targetData },
    isLoading: isLoadingTarget,
  } = useNotifiTargetContext();
  const { updateFtuStage } = useNotifiUserSettingContext();
  const [ftuView, setFtuView] = React.useState<FtuView | null>(null);
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const isInitialLoaded = React.useRef(false);

  React.useEffect(() => {
    if (
      !frontendClientStatus.isAuthenticated ||
      isLoadingTarget ||
      isInitialLoaded.current
    )
      return;
    isInitialLoaded.current = true;
    if (ftuStage === FtuStage.Destination) {
      setFtuView(FtuView.TargetList);
      return;
    }
    setFtuView(FtuView.AlertEdit);
    return;
  }, [isLoadingTarget]);

  if (!ftuView) return null;

  return (
    <div className={clsx('notifi-ftu', props.classNames?.container)}>
      <div className={clsx('notifi-ftu-views', props.classNames?.ftuViews)}>
        {ftuView === FtuView.TargetList ? (
          <FtuTargetList
            copy={props.copy?.FtuTargetList}
            classNames={props.classNames?.FtuTargetList}
            onClickNext={() => setFtuView(FtuView.AlertEdit)}
            navHeaderRightCta={props.navHeaderRightCta}
          />
        ) : null}
        {ftuView === FtuView.AlertEdit ? (
          <FtuAlertEdit
            copy={props.copy?.FtuAlertEdit}
            classNames={props.classNames?.FtuAlertEdit}
            onClickNext={() => {
              setFtuView(null);
              props.onComplete();
            }}
            onClickBack={
              cardConfig?.isContactInfoRequired
                ? () => {
                    if (cardConfig?.isContactInfoRequired) {
                      updateFtuStage(FtuStage.Destination);
                      setFtuView(FtuView.TargetList);
                      return;
                    }
                  }
                : undefined
            }
            navHeaderRightCta={props.navHeaderRightCta}
          />
        ) : null}
      </div>
      <div className={clsx('notifi-ftu-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
