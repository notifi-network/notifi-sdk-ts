import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { TargetInfoPrompt, isCtaInfo } from '../context';
import { LoadingAnimation, LoadingAnimationProps } from './LoadingAnimation';

export type PostCta = LoadingAnimationPostCta | TextPostCta;

type LoadingAnimationPostCta = {
  type: 'loading-animation';
  animationType: LoadingAnimationProps['type'];
  isLoading: boolean;
};

type TextPostCta = {
  type: 'text';
  text: string;
  durationInMs: number;
};

export type TargetCtaProps = {
  type: 'button' | 'link';
  targetInfoPrompt: TargetInfoPrompt;
  postCta: PostCta;
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
  const [isPostCtaShown, setIsPostCtaShown] = React.useState(false);

  React.useEffect(() => {
    if (isLoadingAnimationPostCta(props.postCta)) {
      if (props.postCta.isLoading) {
        return setIsPostCtaShown(true);
      }
      return setIsPostCtaShown(false);
    }
  }, [props.postCta]);

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

            if (!isLoadingAnimationPostCta(props.postCta)) {
              setIsPostCtaShown(true);
              setTimeout(
                () => setIsPostCtaShown(false),
                props.postCta.durationInMs,
              );
            }
          }}
        >
          {isPostCtaShown ? (
            isLoadingAnimationPostCta(props.postCta) ? (
              <LoadingAnimation type={props.postCta.animationType} />
            ) : (
              props.postCta.text
            )
          ) : (
            props.targetInfoPrompt.message
          )}
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

// Utils

const isLoadingAnimationPostCta = (
  postCta: PostCta,
): postCta is LoadingAnimationPostCta => {
  return postCta.type === 'loading-animation';
};
