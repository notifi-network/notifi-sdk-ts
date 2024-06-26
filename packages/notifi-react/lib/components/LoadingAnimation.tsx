import React from 'react';

export type LoadingAnimationProps = React.CSSProperties & {
  type: AnimationType;
};

export type AnimationType = 'spinner';

export const LoadingAnimation: React.FC<LoadingAnimationProps> = (props) => {
  return (
    <div style={props} className="notifi-spinner-container notifi-spinner" />
  );
};
