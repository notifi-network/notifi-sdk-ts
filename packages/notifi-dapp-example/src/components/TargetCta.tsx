import { Icon } from '@/assets/Icon';
import { TargetInfoPrompt, isCtaInfo } from '@notifi-network/notifi-react';
import React from 'react';

export type TargetCtaProps = {
  type: 'button' | 'link';
  targetInfoPrompt: TargetInfoPrompt;
  isCtaDisabled?: boolean;
};

export const TargetCta: React.FC<TargetCtaProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div
      className={`notifi-target-cta ${!isCtaInfo(props.targetInfoPrompt) ? 'ml-0 inline-block w-0 h-4 rounded-[10rem] relative' : ''} ${props.targetInfoPrompt.message === 'Remove' ? 'absolute top-[1.1rem] right-4 cursor-pointer text-xs z-2' : ''}`}
    >
      {isCtaInfo(props.targetInfoPrompt) ? (
        <div
          className={` 
          ${props.type === 'button' ? 'flex justify-center items-center text-sm bg-notifi-button-primary-blueish-bg text-white rounded-3xl w-24 h-8 cursor-pointer' : ''} 
          ${props.type === 'link' ? 'text-sm ml-1 text-notifi-text-medium cursor-pointer' : ''} 
          ${props.type === 'link' && props.targetInfoPrompt.message === 'Remove' ? 'text-sm ml-1 text-notifi-text-medium cursor-pointer' : ''} 
          ${props.isCtaDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} 
        `}
          onClick={async () => {
            if (props.isCtaDisabled) return;
            if (!isCtaInfo(props.targetInfoPrompt)) return;

            setIsLoading(true);
            await props.targetInfoPrompt.onClick();
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-l-transparent text-white" />
            </div>
          ) : (
            props.targetInfoPrompt.message
          )}
        </div>
      ) : null}

      {!isCtaInfo(props.targetInfoPrompt) ? (
        <div className="text-notifi-button-primary-blueish-bg bg-notifi-primary-text rounded-full stroke-[3] flex items-center gap-2 w-4 h-4 absolute top-[3px] left-2">
          <Icon id="check" />
        </div>
      ) : null}
    </div>
  );
};
