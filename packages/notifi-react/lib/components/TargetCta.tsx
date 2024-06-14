import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { TargetInfoPrompt, isCtaInfo } from '../context';

export type TargetCtaProps = {
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

export const TargetCta: React.FC<TargetCtaProps> = (props) => {
  const [ctaCalledSuccessfullyText, setCtaCalledSuccessfullyText] =
    React.useState<string | null>(null);

  return (
    <div className={clsx('notifi-target-cta', props.className?.container)}>
      {isCtaInfo(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            props.type === 'button' && 'notifi-target-cta-button',
            props.type === 'button' && props.className?.actionRequired?.button,
            props.type === 'link' && 'notifi-target-cta-link',
            props.type === 'link' && props.className?.actionRequired?.link,
          )}
          onClick={() => {
            if (!isCtaInfo(props.targetInfoPrompt)) return;
            props.targetInfoPrompt.onClick();
            setCtaCalledSuccessfullyText(
              props.ctaCalledSuccessfullyText ?? 'Done!', // TODO: Move this to defaultCopy
            );
            setTimeout(() => setCtaCalledSuccessfullyText(null), 5000);
          }}
        >
          {ctaCalledSuccessfullyText ?? props.targetInfoPrompt.message}
        </div>
      ) : null}
      {!isCtaInfo(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            'notifi-target-cta-action-not-required',
            props.className?.actionNotRequired,
          )}
        >
          <Icon type="check" />
          {props.targetInfoPrompt.message}
        </div>
      ) : null}
    </div>
  );
};
