import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  FormTarget,
  Target,
  TargetInfo,
  TargetInfoPrompt,
  ToggleTarget,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import { useTargetWallet } from '../hooks/useTargetWallet';
import {
  getAvailableTargetInputCount,
  getTargetValidateRegex,
  isFormTarget,
  isTargetCta,
  isTargetVerified,
  isToggleTarget,
} from '../utils';
import { PostCta, TargetCta, TargetCtaProps } from './TargetCta';
import { TargetInputField } from './TargetInputField';

export type TargetListItemProps = {
  targetListRef: React.RefObject<HTMLDivElement>;
  postCta: PostCta;
  iconType: IconType;
  label: string;
  targetCtaType: TargetCtaProps['type'];
  target: Target;
  targetInfo?: TargetInfo;
  message?: {
    beforeVerify?: string;
    afterVerify?: string;
    beforeVerifyTooltip?: string;
    beforeVerifyTooltipEndingLink?: {
      text: string;
      url: string;
    };
    afterVerifyTooltip?: string;
    afterVerifyTooltipEndingLink?: {
      text: string;
      url: string;
    };
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
    TargetCta?: TargetCtaProps['classNames'];
  };
};

export const TargetListItem: React.FC<TargetListItemProps> = (props) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const {
    targetDocument: { targetData, targetInputs },
    renewTargetGroup,
    updateTargetInputs,
    isChangingTargets,
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  // const isItemRemoved = React.useRef(false);
  const {
    signCoinbaseSignature,
    isLoading: isLoadingWallet,
    error: errorWallet,
  } = useTargetWallet();

  const isRemoveButtonAvailable = () => {
    // TODO: Only for reference, remove before merge.
    // const isRemoveButtonAvailable = (targetInfoPrompt: TargetInfoPrompt) => {
    // if (cardConfig?.isContactInfoRequired) {
    //   return (
    //     getAvailableTargetInputCount(targetInputs) > 1 &&
    //     // isTargetVerified(targetInfoPrompt) &&
    //     props.parentComponent !== 'ftu'
    //   );
    // }
    // return (
    //   isTargetVerified(targetInfoPrompt) && props.parentComponent !== 'ftu'
    // );
    switch (props.target) {
      // TODO: Add case section for each targets
      // case 'discord':
      //   return (
      //     !!props.targetInfo &&
      //     props.targetInfo.infoPrompt.message !== 'Enable Bot'
      //   );
      default:
        return !!props.targetInfo;
    }
  };

  const signupCtaProps: TargetCtaProps = React.useMemo(() => {
    const defaultCtaProps: TargetCtaProps = {
      type: 'button',
      targetInfoPrompt: {
        type: 'cta',
        message: 'Signup',
        onClick: async () => console.log('Default Signup placeHolder'),
      },
      postCta: props.postCta,
      classNames: props.classNames?.TargetCta,
    };

    switch (props.target) {
      case 'email':
      case 'telegram':
        return {
          ...defaultCtaProps,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Signup',
            onClick: async () => {
              const target = props.target as FormTarget;
              renewTargetGroup({
                target: target,
                value: targetInputs[target].value,
              });
            },
          },
        };
      case 'discord':
        return {
          ...defaultCtaProps,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Enable Bot',
            onClick: async () => {
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // await updateTargetInputs(props.target, true);
              const targetGroup = await renewTargetGroup({
                target: props.target as ToggleTarget,
                value: true,
              });

              if (
                targetGroup?.discordTargets?.[0]?.verificationLink &&
                !targetGroup?.discordTargets?.[0]?.isConfirmed
              ) {
                window.open(
                  targetGroup?.discordTargets?.[0]?.verificationLink,
                  '_blank',
                );
              }
            },
          },
        };
      case 'wallet':
        return {
          ...defaultCtaProps,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Sign Wallet',
            onClick: async () => {
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // await updateTargetInputs(props.target, true);
              const targetGroup = await renewTargetGroup({
                target: props.target as ToggleTarget,
                value: true,
              });
              // TODO: Handle error
              const walletTargetId = targetGroup?.web3Targets?.[0]?.id;
              const walletTargetSenderAddress =
                targetGroup?.web3Targets?.[0]?.senderAddress;
              if (
                !targetGroup?.web3Targets?.[0]?.isConfirmed &&
                walletTargetId &&
                walletTargetSenderAddress
              ) {
                const updatedWeb3Target = await signCoinbaseSignature(
                  walletTargetId,
                  walletTargetSenderAddress,
                );
              }
            },
          },
        };
      case 'slack':
        return {
          ...defaultCtaProps,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Signup',
            onClick: async () => {
              await updateTargetInputs(props.target, true);
              const targetGroup = await renewTargetGroup({
                target: props.target as ToggleTarget,
                value: true,
              });
              const verificationLink =
                targetGroup?.slackChannelTargets?.[0]?.verificationLink;
              if (!verificationLink) return;
              window.open(verificationLink, '_blank');
            },
          },
        };
      default:
        return defaultCtaProps;
    }
  }, [
    props.target,
    targetInputs /* renewTargetGroup, updateTargetInputs, signCoinbaseSignature */,
  ]);

  const { componentPosition: tooltipIconPosition } = useComponentPosition(
    tooltipRef,
    props.parentComponent === 'inbox'
      ? 'notifi-inbox-config-target-list-main'
      : 'notifi-ftu-target-list-main',
  );

  if (isFormTarget(props.target))
    return (
      <div
        className={clsx(
          'notifi-target-list-item',
          props.classNames?.targetListItem,
          // NOTE: only used when we want to adopt different style for verified items
          isTargetVerified(props.targetInfo?.infoPrompt) &&
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
          <div
            className={clsx(
              'notifi-target-list-item-target-id',
              props.classNames?.targetId,
            )}
          >
            {/** TODO: Move to use memo once the target display id > 1 format */}
            {targetData[props.target]}
          </div>
          {/* TODO */}
          {!props.targetInfo ? (
            <>
              <label>{props.label}</label>{' '}
              <TargetInputField
                targetType={props.target}
                validateRegex={getTargetValidateRegex(props.target)}
              />
            </>
          ) : null}
        </div>
        {/* TODO: impl after verify message for form targets */}
        {props.message?.beforeVerify &&
        isTargetCta(props.targetInfo?.infoPrompt) ? (
          <div
            className={clsx(
              'notifi-target-list-target-verify-message',
              props.classNames?.verifyMessage,
            )}
          >
            {props.message.beforeVerify}
          </div>
        ) : null}

        {props.targetInfo ? (
          <TargetCta
            type={props.targetCtaType}
            targetInfoPrompt={props.targetInfo.infoPrompt}
            classNames={props.classNames?.TargetCta}
            postCta={props.postCta}
          />
        ) : (
          <>
            {!targetInputs[props.target].error &&
            targetInputs[props.target].value ? (
              <TargetCta {...signupCtaProps} />
            ) : null}
          </>
        )}
        {isRemoveButtonAvailable() ? (
          <TargetListItemAction
            action={async () => {
              // isItemRemoved.current = true;
              // updateTargetInputs(props.target, { value: '' });
              const target = props.target as FormTarget;
              updateTargetInputs(target, { value: '' });
              renewTargetGroup({
                target: target,
                value: '',
              });
            }}
            classNames={{ removeCta: props.classNames?.removeCta }}
          />
        ) : null}
      </div>
    );

  if (isToggleTarget(props.target)) {
    const toggleTargetData = targetData[props.target];
    // return <div>{props.target} TODO</div>;
    return (
      <div
        className={clsx(
          'notifi-target-list-item',
          props.classNames?.targetListItem,
          // NOTE: only used when we want to adopt different style for verified items
          isTargetVerified(props.targetInfo?.infoPrompt) &&
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
        {!isTargetVerified(props.targetInfo?.infoPrompt) ||
        props.parentComponent === 'ftu' ||
        props.target === 'wallet' ? null : (
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
        {props.message?.beforeVerify &&
        (isTargetCta(props.targetInfo?.infoPrompt) || !props.targetInfo) ? (
          <div
            className={clsx(
              'notifi-target-list-target-verify-message',
              props.classNames?.verifyMessage,
            )}
          >
            {props.message.beforeVerify}
            <div className={'notifi-target-list-item-tooltip'} ref={tooltipRef}>
              <Icon
                className={clsx(
                  'notifi-target-list-item-tooltip-icon',
                  props.classNames?.tooltipIcon,
                )}
                type="info"
              />
              <div
                className={clsx(
                  'notifi-target-list-item-tooltip-content',
                  props.classNames?.tooltipContent,
                  props.parentComponent === 'inbox' ? 'inbox' : '',
                  tooltipIconPosition,
                )}
              >
                {props.message.beforeVerifyTooltip}{' '}
                {props.message.beforeVerifyTooltipEndingLink ? (
                  <a
                    href={props.message.beforeVerifyTooltipEndingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {props.message.beforeVerifyTooltipEndingLink.text}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {props.message?.afterVerify &&
        isTargetVerified(props.targetInfo?.infoPrompt) ? (
          <div
            className={clsx(
              'notifi-target-list-target-confirmed-message',
              props.classNames?.verifyMessage,
              props.parentComponent === 'inbox' ? 'inbox' : '',
            )}
          >
            {props.message.afterVerify}
            <div className={'notifi-target-list-item-tooltip'} ref={tooltipRef}>
              <Icon
                className={clsx(
                  'notifi-target-list-item-tooltip-icon',
                  props.classNames?.tooltipIcon,
                )}
                type="info"
              />
              <div
                className={clsx(
                  'notifi-target-list-item-tooltip-content',
                  props.classNames?.tooltipContent,
                  props.parentComponent === 'inbox' ? 'inbox' : '',
                  tooltipIconPosition,
                )}
              >
                {props.message.afterVerifyTooltip}{' '}
                {props.message.afterVerifyTooltipEndingLink ? (
                  <a
                    href={props.message.afterVerifyTooltipEndingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {props.message.afterVerifyTooltipEndingLink.text}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {props.targetInfo ? (
          <TargetCta
            type={props.targetCtaType}
            targetInfoPrompt={props.targetInfo.infoPrompt}
            classNames={props.classNames?.TargetCta}
            postCta={props.postCta}
          />
        ) : (
          <TargetCta {...signupCtaProps} />
        )}

        {/* {props.targetInfo ? ( */}
        {isRemoveButtonAvailable() ? (
          <TargetListItemAction
            action={async () => {
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // updateTargetInputs(props.target, false);
              renewTargetGroup({
                // TODO: Add target type
                target: props.target as ToggleTarget,
                value: false,
              });
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
