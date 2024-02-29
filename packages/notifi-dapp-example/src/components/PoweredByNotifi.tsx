import Image from 'next/image';
import React from 'react';

export type PoweredByNotifiProps = {
  width?: number;
  height?: number;
};

export const PoweredByNotifi: React.FC<PoweredByNotifiProps> = ({
  width,
  height,
}: PoweredByNotifiProps) => {
  // placeholder for now, will use image later
  return (
    <Image
      src="/logos/powered-by-notifi.png"
      width={width ? width : 96}
      height={height ? height : 13}
      alt="Injective"
    />
  );
};
