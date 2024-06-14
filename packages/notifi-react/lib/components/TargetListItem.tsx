import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  Target,
  TargetInfo,
  TargetInfoPrompt,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import {
  getAvailableTargetInputCount,
  isFormTarget,
  isTargetCta,
  isTargetVerified,
  isToggleTarget,
} from '../utils';
import { TargetCta, TargetCtaProps } from './TargetCta';

export type TargetListItemProps = {
  iconType: IconType;
  label: string;
  targetCtaType: TargetCtaProps['type'];
  target: Target;
  targetInfo: TargetInfo;
  ctaCalledSuccessfullyText?: string;
  message?: {
    beforeVerify?: string;
    afterVerify?: string;
    beforeVerifyTooltip?: string;
    afterVerifyTooltip?: string;
  };
  parentComponent?: 'inbox' | 'ftu';
  classNames?: {
    targetListItem?: string;
    targetListVerifiedItem?: string;
    targetListItemTarget?: string;
    icon?: string;
    removeCta?: string;
    verifyMessage?: string;
    tooltipIcon?: string;
    tooltipContent?: string;
    targetId?: string;
    TargetCta?: TargetCtaProps['className'];
  };
};

export const TargetListItem: React.FC<TargetListItemProps> = (props) => {
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
    isChangingTargets,
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const isItemRemoved = React.useRef(false);

  React.useEffect(() => {
    if (!isItemRemoved.current) return;
    const hasChange = !Object.values(isChangingTargets).every(
      (hasChange) => !hasChange,
    );
    hasChange && renewTargetGroup();
    isItemRemoved.current = false;
  }, [isChangingTargets]);
  const isRemoveButtonAvailable = (targetInfoPrompt: TargetInfoPrompt) => {
    if (cardConfig?.isContactInfoRequired) {
      return (
        getAvailableTargetInputCount(targetInputs) > 1 &&
        isTargetVerified(targetInfoPrompt) &&
        props.parentComponent !== 'ftu'
      );
    }
    return (
      isTargetVerified(targetInfoPrompt) && props.parentComponent !== 'ftu'
    );
  };

  if (!targetData[props.target] || !props.targetInfo.infoPrompt) return null;

  if (isFormTarget(props.target))
    return (
      <div
        className={clsx(
          'notifi-target-list-item',
          props.classNames?.targetListItem,
          // NOTE: only used when we want to adopt different style for verified items
          isTargetVerified(props.targetInfo.infoPrompt) &&
            props.classNames?.targetListVerifiedItem,
        )}
      >
        <div
          className={clsx(
            'notifi-target-list-item-target',
            props.classNames?.targetListItemTarget,
          )}
        >
          <Icon
            type={props.iconType}
            className={clsx('notifi-target-list-icon', props.classNames?.icon)}
          />
          <label>{props.label}</label>
        </div>
        {/* TODO: impl after verify message for form targets */}
        {props.message?.beforeVerify &&
        isTargetCta(props.targetInfo.infoPrompt) ? (
          <div
            className={clsx(
              'notifi-target-list-target-verify-message',
              props.classNames?.verifyMessage,
            )}
          >
            {props.message.beforeVerify}
          </div>
        ) : null}
        {isTargetVerified(props.targetInfo.infoPrompt) &&
        props.parentComponent === 'ftu' ? null : (
          <div
            className={clsx(
              'notifi-target-list-item-target-id',
              props.classNames?.targetId,
            )}
          >
            {/** TODO: Move to use memo once the target display id > 1 format */}
            {targetData[props.target]}
          </div>
        )}
        <TargetCta
          type={props.targetCtaType}
          targetInfoPrompt={props.targetInfo.infoPrompt}
          ctaCalledSuccessfullyText={props.ctaCalledSuccessfullyText}
          className={props.classNames?.TargetCta}
        />
        {isRemoveButtonAvailable(props.targetInfo.infoPrompt) ? (
          <TargetListItemAction
            action={async () => {
              isItemRemoved.current = true;
              updateTargetInputs(props.target, { value: '' });
            }}
            classNames={{ removeCta: props.classNames?.removeCta }}
          />
        ) : null}
      </div>
    );

  if (isToggleTarget(props.target)) {
    const toggleTargetData = targetData[props.target];
    return (
      <div
        className={clsx(
          'notifi-target-list-item',
          props.classNames?.targetListItem,
          // NOTE: only used when we want to adopt different style for verified items
          isTargetVerified(props.targetInfo.infoPrompt) &&
            props.classNames?.targetListVerifiedItem,
        )}
      >
        <div
          className={clsx(
            'notifi-target-list-item-target',
            props.classNames?.targetListItemTarget,
          )}
        >
          <Icon
            type={props.iconType}
            className={clsx('notifi-target-list-icon', props.classNames?.icon)}
          />
          <label>{props.label}</label>
        </div>
        {!isTargetVerified(props.targetInfo.infoPrompt) ||
        props.parentComponent === 'ftu' ? null : (
          <div
            className={clsx(
              'notifi-target-list-item-target-id',
              props.classNames?.targetId,
            )}
          >
            {/** TODO: Move to use memo once the target display id > 1 format */}
            {/** Display Discord username */}
            {toggleTargetData?.data &&
              'username' in toggleTargetData.data &&
              `@${toggleTargetData.data.username}`}
          </div>
        )}
        {/* TODO: impl before verify message for toggle targets */}
        {props.message?.afterVerify &&
        isTargetVerified(props.targetInfo.infoPrompt) ? (
          <div
            className={clsx(
              'notifi-target-list-target-confirmed-message',
              props.classNames?.verifyMessage,
              props.parentComponent === 'inbox' ? 'inbox' : '',
            )}
          >
            {props.message.afterVerify}
            <div className={'notifi-target-list-target-confirm-tooltip'}>
              <Icon
                className={clsx(
                  'notifi-target-list-target-confirm-tooltip-icon',
                  props.classNames?.tooltipIcon,
                )}
                type="info"
              />
              <div
                className={clsx(
                  'notifi-target-list-target-confirm-tooltip-content',
                  props.classNames?.tooltipContent,
                  props.parentComponent === 'inbox' ? 'inbox' : '',
                )}
              >
                {props.message.afterVerifyTooltip}
              </div>
            </div>
          </div>
        ) : null}
        <TargetCta
          type={props.targetCtaType}
          targetInfoPrompt={props.targetInfo.infoPrompt}
          className={props.classNames?.TargetCta}
        />
        {isRemoveButtonAvailable(props.targetInfo.infoPrompt) ? (
          <TargetListItemAction
            action={async () => {
              isItemRemoved.current = true;
              updateTargetInputs(props.target, false);
            }}
            classNames={{ removeCta: props.classNames?.removeCta }}
          />
        ) : null}
      </div>
    );
  }

  return null;
};

type TargetListItemActionProps = {
  action: () => Promise<void>;
  classNames?: {
    removeCta?: string;
  };
  actionText?: string;
};

export const TargetListItemAction: React.FC<TargetListItemActionProps> = (
  props,
) => {
  return (
    <div
      className={clsx(
        'notifi-target-list-item-remove',
        props.classNames?.removeCta,
      )}
      onClick={props.action}
    >
      {props.actionText ?? 'Remove'}
    </div>
  );
};
