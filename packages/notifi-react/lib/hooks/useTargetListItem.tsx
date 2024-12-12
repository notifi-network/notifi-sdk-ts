import React from 'react';

import { PostCta, TargetCtaProps } from '../components/TargetCta';
import {
  FormTarget,
  Target,
  ToggleTarget,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { hasValidTargetMoreThan } from '../utils';
import { useTargetWallet } from './useTargetWallet';

export const useTargetListItem = (input: {
  target: Target;
  postCta: PostCta;
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
          targetInfo.infoPrompt.message !== 'Set up' &&
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
  }, [input.target, targetData, cardConfig]); // TODO: review the dependency

  const signupCtaProps: TargetCtaProps = React.useMemo(() => {
    const defaultCtaProps: TargetCtaProps = {
      type: 'button',
      targetInfoPrompt: {
        type: 'cta',
        message: 'Signup',
        onClick: async () => console.log('Default Signup placeHolder'),
      },
      postCta: input.postCta,
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
          isCtaDisabled: !targetData[input.target].isAvailable,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Enable Bot',
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
          isCtaDisabled: !targetData[input.target].isAvailable,
          type: 'button',
          targetInfoPrompt: {
            type: 'cta',
            message: 'Signup',
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

  return {
    signupCtaProps,
    isRemoveButtonAvailable,
  };
};
