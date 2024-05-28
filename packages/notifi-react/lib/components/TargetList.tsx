import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import {
  TargetInfoPrompt,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import {
  getAvailableTargetInputCount,
  isTargetCta,
  isTargetVerified,
} from '../utils';
import { defaultCopy } from '../utils/constants';
import { TargetCta, TargetCtaProps } from './TargetCta';

type TargetListProps = {
  classNames?: {
    container?: string;
    targetListItem?: string;
    targetListVerifiedItem?: string;
    targetListItemTarget?: string;
    icon?: string;
    TargetCta?: TargetCtaProps['className'];
    removeCta?: string;
    verifyMessage?: string;
  };
  copy?: {
    email?: string;
    sms?: string;
    telegram?: string;
    discord?: string;
    slack?: string;
    emailVerifyMessage?: string;
  };
  parentComponent?: 'inbox' | 'ftu';
};

export const TargetList: React.FC<TargetListProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const {
    targetDocument: { targetInfoPrompts, targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
    isChangingTargets,
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const isItemRemoved = React.useRef(false);
  // TODO: extract to a separate component for each target

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
        parentComponent !== 'ftu'
      );
    }
    return isTargetVerified(targetInfoPrompt) && parentComponent !== 'ftu';
  };

  return (
    <div className={clsx('notifi-target-list', props.classNames?.container)}>
      {targetData.email && targetInfoPrompts.email?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
            // NOTE: only used when we want to adopt different style for verified items
            isTargetVerified(targetInfoPrompts.email.infoPrompt) &&
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
              type="email"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>{props.copy?.email ?? defaultCopy.targetList.email}</label>
          </div>

          {isTargetCta(targetInfoPrompts.email.infoPrompt) ? (
            <div
              className={clsx(
                'notifi-target-list-target-verify-message',
                props.classNames?.verifyMessage,
              )}
            >
              {props.copy?.emailVerifyMessage ??
                defaultCopy.targetList.emailVerifyMessage}
            </div>
          ) : null}

          {isTargetVerified(targetInfoPrompts.email.infoPrompt) &&
          parentComponent === 'ftu' ? null : (
            <div>{targetData.email}</div>
          )}
          <TargetCta
            type="link"
            targetInfoPrompt={targetInfoPrompts.email.infoPrompt}
            ctaCalledSuccessfullyText="Email sent"
            className={props.classNames?.TargetCta}
          />
          {isRemoveButtonAvailable(targetInfoPrompts.email.infoPrompt) ? (
            <TargetListItemAction
              action={async () => {
                isItemRemoved.current = true;
                updateTargetInputs('email', { value: '' });
              }}
              classNames={{ removeCta: props.classNames?.removeCta }}
            />
          ) : null}
        </div>
      ) : null}

      {targetData.phoneNumber && targetInfoPrompts.phoneNumber?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
            // NOTE: only used when we want to adopt different style for verified items
            isTargetVerified(targetInfoPrompts.phoneNumber.infoPrompt) &&
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
              type="sms"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.sms ?? defaultCopy.targetList.phoneNumber}
            </label>
          </div>

          {isTargetVerified(targetInfoPrompts.phoneNumber.infoPrompt) &&
          parentComponent === 'ftu' ? null : (
            <div>{targetData.phoneNumber}</div>
          )}
          <TargetCta
            type="link"
            targetInfoPrompt={targetInfoPrompts.phoneNumber.infoPrompt}
            className={props.classNames?.TargetCta}
          />
          {isRemoveButtonAvailable(targetInfoPrompts.phoneNumber.infoPrompt) ? (
            <TargetListItemAction
              action={async () => {
                isItemRemoved.current = true;
                updateTargetInputs('phoneNumber', { value: '' });
              }}
              classNames={{ removeCta: props.classNames?.removeCta }}
            />
          ) : null}
        </div>
      ) : null}

      {targetData.telegram && targetInfoPrompts.telegram?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
            // NOTE: only used when we want to adopt different style for verified items
            isTargetVerified(targetInfoPrompts.telegram.infoPrompt) &&
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
              type="telegram"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.telegram ?? defaultCopy.targetList.telegram}
            </label>
          </div>

          {isTargetVerified(targetInfoPrompts.telegram.infoPrompt) &&
          parentComponent === 'ftu' ? null : (
            <div>{targetData.telegram}</div>
          )}
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.telegram.infoPrompt}
            className={props.classNames?.TargetCta}
          />
          {isRemoveButtonAvailable(targetInfoPrompts.telegram.infoPrompt) ? (
            <TargetListItemAction
              action={async () => {
                isItemRemoved.current = true;
                updateTargetInputs('telegram', { value: '' });
              }}
              classNames={{ removeCta: props.classNames?.removeCta }}
            />
          ) : null}
        </div>
      ) : null}

      {targetData.discord.useDiscord &&
      targetInfoPrompts.discord?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
            // NOTE: only used when we want to adopt different style for verified items
            isTargetVerified(targetInfoPrompts.discord.infoPrompt) &&
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
              type="discord"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>
              {props.copy?.discord ?? defaultCopy.targetList.discord}
            </label>
          </div>
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.discord.infoPrompt}
            className={props.classNames?.TargetCta}
          />
          {isRemoveButtonAvailable(targetInfoPrompts.discord.infoPrompt) ? (
            <TargetListItemAction
              action={async () => {
                isItemRemoved.current = true;
                updateTargetInputs('discord', false);
              }}
              classNames={{ removeCta: props.classNames?.removeCta }}
            />
          ) : null}
        </div>
      ) : null}

      {targetData.slack.useSlack && targetInfoPrompts.slack?.infoPrompt ? (
        <div
          className={clsx(
            'notifi-target-list-item',
            props.classNames?.targetListItem,
            // NOTE: only used when we want to adopt different style for verified items
            isTargetVerified(targetInfoPrompts.slack.infoPrompt) &&
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
              type="slack"
              className={clsx(
                'notifi-target-list-icon',
                props.classNames?.icon,
              )}
            />
            <label>{props.copy?.slack ?? defaultCopy.targetList.slack}</label>
          </div>
          <TargetCta
            type="button"
            targetInfoPrompt={targetInfoPrompts.slack.infoPrompt}
            className={props.classNames?.TargetCta}
          />
          {isRemoveButtonAvailable(targetInfoPrompts.slack.infoPrompt) ? (
            <TargetListItemAction
              action={async () => {
                isItemRemoved.current = true;
                updateTargetInputs('slack', false);
              }}
              classNames={{ removeCta: props.classNames?.removeCta }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
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
