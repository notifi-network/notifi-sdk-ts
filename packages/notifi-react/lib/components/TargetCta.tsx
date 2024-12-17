import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { TargetInfoPrompt, isCtaInfo } from '../context';
import { LoadingAnimation, LoadingAnimationProps } from './LoadingAnimation';

// export type PostCta = LoadingAnimationPostCta | TextPostCta;

type LoadingAnimationPostCta = {
  type: 'loading-animation';
  animationType: LoadingAnimationProps['type'];
};

type TextPostCta = {
  type: 'text';
  text: string;
  durationInMs: number;
};

export type TargetCtaProps = {
  type: 'button' | 'link';
  targetInfoPrompt: TargetInfoPrompt;
  // postCta: PostCta;
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
  // const [isPostCtaShown, setIsPostCtaShown] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // TODO: remove postCta related
  // React.useEffect(() => {
  //   if (isLoadingAnimationPostCta(props.postCta)) {
  //     if (isLoading) {
  //       return setIsPostCtaShown(true);
  //     }
  //     return setIsPostCtaShown(false);
  //   }
  // }, [isLoading]);

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
            // TODO: remove postCta related
            // if (!isLoadingAnimationPostCta(props.postCta)) {
            //   setTimeout(
            //     () => setIsPostCtaShown(false),
            //     props.postCta.durationInMs,
            //   );
            // }
          }}
        >
          {isLoading ? (
            <LoadingAnimation
              type={'spinner'}
              // type={props.postCta.animationType}
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

// Utils
// TODO: remove postCta related
// const isLoadingAnimationPostCta = (
//   postCta: PostCta,
// ): postCta is LoadingAnimationPostCta => {
//   return postCta.type === 'loading-animation';
// };
