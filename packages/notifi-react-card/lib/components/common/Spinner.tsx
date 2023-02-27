import React from 'react';

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size, color }) => {
  return (
    <div
      className="NotifiSpinner"
      style={{ height: size, width: size, borderTopColor: color }}
    />
  );
};

export default Spinner;
