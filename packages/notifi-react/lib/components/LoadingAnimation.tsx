import clsx from 'clsx';
import React from 'react';

export type LoadingAnimationProps = React.CSSProperties & {
  type: AnimationType;
  classNames?: {
    spinner?: string;
  };
};

export type AnimationType = 'spinner';

export const LoadingAnimation: React.FC<LoadingAnimationProps> = (props) => {
  return (
    <div
      style={props}
      className={clsx(
        'notifi-spinner-container',
        'notifi-spinner',
        props.classNames?.spinner,
      )}
    />
  );
};
