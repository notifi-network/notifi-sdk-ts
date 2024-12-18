import React from 'react';

import { TargetCtaProps } from '../components/TargetCta';
import {
  TargetListItemMessage,
  TooltipEndingLink,
} from '../components/TargetListItem';
import {
  FormTarget,
  Target,
  ToggleTarget,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import {
  hasValidTargetMoreThan,
  isTargetCta,
  isTargetVerified,
} from '../utils';
import { useTargetWallet } from './useTargetWallet';

type ClassifiedTargetListItemMessage = {
  type: 'signup' | 'verify' | 'complete';
  content: string;
  tooltip?: string;
  tooltipEndingLink?: TooltipEndingLink;
};

export const useTargetListItem = (input: {
  target: Target;
  message?: TargetListItemMessage;
}) => {
  const { cardConfig } = useNotifiTenantConfigContext();
  const { signCoinbaseSignature } = useTargetWallet();
  const {
    targetDocument: { targetData, targetInputs, targetInfoPrompts },
    renewTargetGroup,
    updateTargetInputs,
  } = useNotifiTargetContext();
  const isRemoveButtonAvailable = React.useMemo(() => {
    const isTargetRemovable = !!cardConfig?.isContactInfoRequired
      ? hasValidTargetMoreThan(targetData, 1)
      : true;

    targetData[input.target];
    const targetInfo = targetInfoPrompts[input.target];
    switch (input.target) {
      case 'discord':
        return (
          !!targetInfo &&
          targetInfo.infoPrompt.message !== 'Set Up' &&
          isTargetRemovable
        );
      case 'slack':
        return (
          !!targetInfo &&
          targetInfo.infoPrompt.message !== 'Set Up' &&
          isTargetRemovable
        );
      case 'wallet':
        return (
          !!targetInfo &&
          targetInfo.infoPrompt.message !== 'Sign Wallet' &&
          isTargetRemovable
        );
      default:
        return !!targetInfo && isTargetRemovable;
    }
  }, [input.target, targetData, cardConfig, targetInfoPrompts]);

  const signupCtaProps: TargetCtaProps = React.useMemo(() => {
    const defaultCtaProps: TargetCtaProps = {
      type: 'button',
      targetInfoPrompt: {
        type: 'cta',
        message: 'Signup',
        onClick: async () => console.log('Default Signup placeHolder'),
      },
    };

    switch (input.target) {
      case 'email':
      case 'telegram':
        return {
          ...defaultCtaProps,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Signup',
            onClick: async () => {
              const target = input.target as FormTarget;
              await renewTargetGroup({
                target: target,
                value: targetInputs[target].value,
              });
              //NOTE: Wait for 1 second for target context state change
              await new Promise((resolve) => setTimeout(resolve, 1000));
            },
          },
        };
      case 'discord':
        return {
          ...defaultCtaProps,
          isCtaDisabled: !targetData[input.target].isAvailable,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Set Up',
            onClick: async () => {
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // await updateTargetInputs(props.target, true);
              const targetGroup = await renewTargetGroup({
                target: input.target as ToggleTarget,
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
              //NOTE: Wait for 1 second for target context state change
              await new Promise((resolve) => setTimeout(resolve, 1000));
            },
          },
        };
      case 'wallet':
        return {
          ...defaultCtaProps,
          isCtaDisabled: !targetData[input.target].isAvailable,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Sign Wallet',
            onClick: async () => {
              // TODO: Remove this after adding documentation: 1. single target subscription always sync with with targetData. 2. targetInput & multiple target subscription.
              // await updateTargetInputs(props.target, true);
              const targetGroup = await renewTargetGroup({
                target: input.target as ToggleTarget,
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
                // TODO: Remove unused variable
                const _updatedWeb3Target = await signCoinbaseSignature(
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
          isCtaDisabled: !targetData[input.target].isAvailable,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Set Up',
            onClick: async () => {
              await updateTargetInputs(input.target, true);
              const targetGroup = await renewTargetGroup({
                target: input.target as ToggleTarget,
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
    input.target,
    targetInputs /* renewTargetGroup, updateTargetInputs, signCoinbaseSignature */, //TODO: econsider the dependency
  ]);

  const classifiedTargetListItemMessage: ClassifiedTargetListItemMessage | null =
    React.useMemo(() => {
      const targetInfo = targetInfoPrompts[input.target];
      // SIGNUP MESSAGE
      if (!targetInfo && input.message?.beforeSignup) {
        return {
          type: 'signup',
          content: input.message.beforeSignup,
          tooltip: input.message.beforeSignupTooltip,
          tooltipEndingLink: input.message.beforeSignupTooltipEndingLink,
        };
      }
      // VERIFY MESSAGE
      if (isTargetCta(targetInfo?.infoPrompt) && input.message?.beforeVerify) {
        return {
          type: 'verify',
          content: input.message.beforeVerify,
          tooltip: input.message.beforeVerifyTooltip,
          tooltipEndingLink: input.message.beforeVerifyTooltipEndingLink,
        };
      }
      // COMPLETE MESSAGE
      if (
        isTargetVerified(targetInfo?.infoPrompt) &&
        input.message?.afterVerify
      ) {
        return {
          type: 'complete',
          content: input.message.afterVerify,
          tooltip: input.message.afterVerifyTooltip,
          tooltipEndingLink: input.message.afterVerifyTooltipEndingLink,
        };
      }
      return null;
    }, [targetInfoPrompts[input.target], input.message]);

  return {
    signupCtaProps,
    isRemoveButtonAvailable,
    classifiedTargetListItemMessage,
  };
};