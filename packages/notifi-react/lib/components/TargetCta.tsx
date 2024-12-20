import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { TargetInfoPrompt, isCtaInfo } from '../context';
import { LoadingAnimation } from './LoadingAnimation';

export type TargetCtaProps = {
  type: 'button' | 'link';
  targetInfoPrompt: TargetInfoPrompt;
  isCtaDisabled?: boolean;
  classNames?: {
    container?: string;
    actionRequired?: {
      button?: string;
      link?: string;
    };
    actionNotRequired?: string;
    loadingSpinner?: React.CSSProperties;
  };
};

export const TargetCta: React.FC<TargetCtaProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div
      className={clsx(
        'notifi-target-cta',
        !isCtaInfo(props.targetInfoPrompt) && 'no-action-required',
        props.classNames?.container,
      )}
    >
      {isCtaInfo(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            props.type === 'button' && 'notifi-target-cta-button',
            props.type === 'button' && props.classNames?.actionRequired?.button,
            props.type === 'link' && 'notifi-target-cta-link',
            props.type === 'link' && props.classNames?.actionRequired?.link,
            (props.isCtaDisabled || isLoading) && 'disabled',
          )}
          onClick={async () => {
            if (props.isCtaDisabled) return;
            if (!isCtaInfo(props.targetInfoPrompt)) return;

            setIsLoading(true);
            await props.targetInfoPrompt.onClick();
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <LoadingAnimation
              type={'spinner'}
              classNames={{ spinner: 'notifi-target-cta-loading-spinner' }}
            />
          ) : (
            props.targetInfoPrompt.message
          )}
        </div>
      ) : null}

      {!isCtaInfo(props.targetInfoPrompt) ? (
        <div
          className={clsx(
            'notifi-target-cta-action-not-required',
            props.classNames?.actionNotRequired,
          )}
        >
          <Icon type="check" />
        </div>
      ) : null}
    </div>
  );
};
