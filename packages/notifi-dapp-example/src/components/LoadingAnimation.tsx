import React from 'react';

type Props = React.CSSProperties & { type: AnimationType };

export type AnimationType = 'spinner';

export const LoadingAnimation: React.FC<Props> = (props) => {
  return (
    <div style={props} className="notifi-spinner-container notifi-spinner" />
  );
};
