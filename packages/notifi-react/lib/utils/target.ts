import { objectKeys } from '@notifi-network/notifi-frontend-client';

import {
  CtaInfo,
  FormTarget,
  Target,
  TargetData,
  TargetInfoPrompt,
  TargetInputs,
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
): targetInfoPrompt is CtaInfo => {
  return targetInfoPrompt.type === 'message';
};

const isFormTarget = (target: Target): target is FormTarget => {
  return (
    target === 'email' || target === 'phoneNumber' || target === 'telegram'
  );
};
