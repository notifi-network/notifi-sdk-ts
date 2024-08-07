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

export const formatTelegramForSubscription = (telegramId: string) => {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
};

export const reformatSignatureForWalletTarget = (
  signature: Uint8Array | string,
) => {
  if (!signature) return '';

  let hexString = '0x';

  Object.values(signature).forEach(
    (v) => (hexString += v.toString(16).padStart(2, '0')),
  );

  return hexString;
};

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

export const getWalletTargetSignMessage = (
  address: string,
  senderAddress: string,
  nonce: string,
) =>
  `Coinbase Wallet Messaging subscribe\nAddress: ${address}\nPartner Address: ${senderAddress}\nNonce: ${nonce}`;

export const getTargetValidateRegex = (
  target: Extract<Target, 'email' | 'telegram'>,
) => {
  switch (target) {
    case 'email':
      return new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    case 'telegram':
      return new RegExp('.{5,}');
    default:
      throw new Error('Not supported target type');
  }
};
