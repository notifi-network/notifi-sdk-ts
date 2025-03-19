import { objectKeys } from '@notifi-network/notifi-frontend-client';

// NOTE: Only import "type" to avoid circular dependency
import type {
  CtaInfo,
  FormTarget,
  MessageInfo,
  Target,
  TargetData,
  TargetInfoPrompt,
  ToggleTarget,
} from '../context';

export const formTargets = ['email', 'phoneNumber'] as const;
export const toggleTargets = [
  'discord',
  'slack',
  'telegram',
  'wallet',
] as const;

export const hasTarget = (targetData: TargetData) => {
  return !objectKeys(targetData).every((key) => {
    const target = targetData[key];
    // Target form type
    if (typeof target === 'string') {
      return !target;
    }
    // Target toggle type
    if (typeof target === 'object') {
      return !target.data;
    }
  });
};

export const hasValidTargetMoreThan = (
  targetData: TargetData,
  moreThan: number,
) => {
  return (
    objectKeys(targetData).filter((key) => {
      const target = targetData[key];
      // NOTE: formTargets are considered valid as long as they are not empty (even if they are not confirmed)
      if (typeof target === 'string' && target !== '') {
        return target;
      }

      if (typeof target === 'object') {
        // NOTE: toggleTargets are considered valid only if they are confirmed
        if (key === 'discord' || key === 'wallet' || key === 'telegram') {
          return !!targetData[key].data?.isConfirmed;
        }
        if (key === 'slack') {
          return targetData[key].data?.verificationStatus === 'VERIFIED';
        }
      }
    }).length > moreThan
  );
};

export const isTargetCta = (
  targetInfoPrompt: TargetInfoPrompt | undefined,
): targetInfoPrompt is CtaInfo => {
  return targetInfoPrompt?.type === 'cta';
};

export const isTargetVerified = (
  targetInfoPrompt: TargetInfoPrompt | undefined,
): targetInfoPrompt is MessageInfo => {
  return (
    targetInfoPrompt?.type === 'message' &&
    targetInfoPrompt.message === 'Verified'
  );
};

export const isFormTarget = (target: Target): target is FormTarget => {
  const supportedFormTargets: Target[] = ['email', 'phoneNumber'];
  return supportedFormTargets.includes(target);
};

export const isToggleTarget = (target: Target): target is ToggleTarget =>
  toggleTargets.includes(target as ToggleTarget);

export const getTargetValidateRegex = (target: FormTarget) => {
  switch (target) {
    case 'email':
      return new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    case 'phoneNumber':
      return undefined;
    default:
      throw new Error('Not supported target type');
  }
};
