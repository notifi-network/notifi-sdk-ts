import { objectKeys } from '@notifi-network/notifi-frontend-client';

import {
  CtaInfo,
  FormTarget,
  MessageInfo,
  Target,
  TargetData,
  TargetInfoPrompt,
  TargetInputs,
  ToggleTarget,
} from '../context';

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

export const getAvailableTargetInputCount = (targetInputs: TargetInputs) => {
  return objectKeys(targetInputs).filter((key) => {
    if (isFormTarget(key)) {
      return targetInputs[key].value;
    }
    return targetInputs[key];
  }).length;
};

export const isTargetCta = (
  targetInfoPrompt: TargetInfoPrompt,
): targetInfoPrompt is CtaInfo => {
  return targetInfoPrompt.type === 'cta';
};

export const isTargetVerified = (
  targetInfoPrompt: TargetInfoPrompt,
): targetInfoPrompt is MessageInfo => {
  return targetInfoPrompt.type === 'message';
};

export const isFormTarget = (target: Target): target is FormTarget => {
  const supportedFormTargets: Target[] = ['email', 'phoneNumber', 'telegram'];
  return supportedFormTargets.includes(target);
};

export const isToggleTarget = (target: Target): target is ToggleTarget => {
  const supportedToggleTargets: Target[] = ['discord', 'slack', 'wallet'];
  return supportedToggleTargets.includes(target);
};
