import React from 'react';

interface SpinnerProps {
  size?: string;
  ringColor?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size, ringColor }) => {
  return (
    <div
      className="NotifiSpinner"
      style={{ height: size, width: size, borderTopColor: ringColor }}
    />
  );
};

export default Spinner;
