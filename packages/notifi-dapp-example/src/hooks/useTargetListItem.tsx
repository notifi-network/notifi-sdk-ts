import {
  FormTarget,
  Target,
  ToggleTarget,
  hasValidTargetMoreThan,
  isTargetCta,
  isTargetVerified,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TargetCtaProps } from '../components/TargetCta';
import {
  TargetListItemMessage,
  TooltipEndingLink,
} from '../components/TargetListItem';
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
  const {
    targetDocument: { targetData, targetInputs, targetInfoPrompts },
    renewTargetGroup,
    plugin,
  } = useNotifiTargetContext();

  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const isRemoveButtonAvailable = React.useMemo(() => {
    const isTargetRemovable = cardConfig?.isContactInfoRequired
      ? hasValidTargetMoreThan(targetData, 0)
      : true;

    const targetInfo = targetInfoPrompts[input.target];
    const removableTargetExists = !!targetInfo && isTargetRemovable;
    const isTargetSignedUp = (signupMessage: string) =>
      !['Set Up', 'Sign Wallet'].includes(signupMessage);
    return (
      removableTargetExists && isTargetSignedUp(targetInfo.infoPrompt.message)
    );
  }, [input.target, targetData, cardConfig, targetInfoPrompts]);

  const signupCtaProps: TargetCtaProps = React.useMemo(() => {
    const defaultCtaProps: TargetCtaProps = {
      type: 'button',
      targetInfoPrompt: {
        type: 'cta',
        message: 'Signup',
        onClick: async () => {
          const errorMsg = `ERROR: No signup action defined for target: ${input.target}`;
          console.error(errorMsg);
        },
      },
    };

    switch (input.target) {
      case 'email':
        return {
          ...defaultCtaProps,
          targetInfoPrompt: {
            type: 'cta',
            message: 'Save',
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
      case 'telegram':
        return {
          ...defaultCtaProps,
          isCtaDisabled: !targetData[input.target].isAvailable,
          targetInfoPrompt: {
            type: 'cta',
            message: 'Set Up',
            onClick: async () => {
              const targetGroup = await renewTargetGroup({
                target: input.target as ToggleTarget,
                value: true,
              });
              if (
                targetGroup?.telegramTargets?.[0]?.confirmationUrl &&
                !targetGroup?.telegramTargets?.[0]?.isConfirmed
              ) {
                const confirmationUrl =
                  targetGroup?.telegramTargets?.[0]?.confirmationUrl;

                // Attempt to open a new window
                const newWindow = window.open(confirmationUrl, '_blank');

                // Check if the new window was blocked or failed to open
                if (
                  !newWindow ||
                  newWindow.closed ||
                  typeof newWindow.closed === 'undefined'
                ) {
                  window.location.href = confirmationUrl;
                }
              }
              //NOTE: Wait for 1 second for target context state change
              await new Promise((resolve) => setTimeout(resolve, 1000));
            },
          },
        };
      case 'discord':
        return {
          ...defaultCtaProps,
          isCtaDisabled: !targetData[input.target].isAvailable,
          targetInfoPrompt: {
            type: 'cta',
            message: 'Set Up',
            onClick: async () => {
              const targetGroup = await renewTargetGroup({
                target: input.target as ToggleTarget,
                value: true,
              });

              if (
                targetGroup?.discordTargets?.[0]?.verificationLink &&
                !targetGroup?.discordTargets?.[0]?.isConfirmed
              ) {
                const confirmationUrl =
                  targetGroup?.discordTargets?.[0]?.verificationLink;

                // Attempt to open a new window
                const newWindow = window.open(confirmationUrl, '_blank');

                // Check if the new window was blocked or failed to open
                if (
                  !newWindow ||
                  newWindow.closed ||
                  typeof newWindow.closed === 'undefined'
                ) {
                  window.location.href = confirmationUrl;
                }
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
          targetInfoPrompt: {
            type: 'cta',
            message: 'Sign Wallet',
            onClick: async () => {
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
                await plugin?.walletTarget.signCoinbaseSignature(
                  frontendClient,
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
          targetInfoPrompt: {
            type: 'cta',
            message: 'Set Up',
            onClick: async () => {
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
  }, [input.target, targetInputs, renewTargetGroup]);

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
