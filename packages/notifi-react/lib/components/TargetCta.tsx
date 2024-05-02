import clsx from 'clsx';
import React from 'react';

import { CtaInfo, TargetInfoPrompt } from '../context';

type TargetCtaProps = {
  type: 'button' | 'link';
  ctaCalledSuccessfullyText?: string;
  targetInfoPrompt: TargetInfoPrompt;
  className?: {
    container?: string;
    actionRequired?: {
      button?: string;
      link?: string;
    };
    actionNotRequired?: string;
  };
};
const validateCta = (
  targetInfoPrompt: TargetInfoPrompt,
): targetInfoPrompt is CtaInfo => {
  return targetInfoPrompt.type === 'cta';
};

export const TargetCta: React.FC<TargetCtaProps> = (props) => {
  const [ctaCalledSuccessfullyText, setCtaCalledSuccessfullyText] =
    React.useState<string | null>(null);

  return (
    <div className={clsx('notifi-target-cta', props.className?.container)}>
      {validateCta(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            props.type === 'button' && 'notifi-target-cta-button',
            props.type === 'button' && props.className?.actionRequired?.button,
            props.type === 'link' && 'notifi-target-cta-link',
            props.type === 'link' && props.className?.actionRequired?.link,
          )}
          onClick={() => {
            if (!validateCta(props.targetInfoPrompt)) return;
            props.targetInfoPrompt.onClick();
            setCtaCalledSuccessfullyText(
              props.ctaCalledSuccessfullyText ?? 'Done!',
            );
            setTimeout(() => setCtaCalledSuccessfullyText(null), 5000);
          }}
        >
          {ctaCalledSuccessfullyText ?? props.targetInfoPrompt.message}
        </div>
      ) : null}
      {!validateCta(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            'notifi-target-cta-action-not-required',
            props.className?.actionNotRequired,
          )}
        >
          {props.targetInfoPrompt.message}
        </div>
      ) : null}
    </div>
  );
};
