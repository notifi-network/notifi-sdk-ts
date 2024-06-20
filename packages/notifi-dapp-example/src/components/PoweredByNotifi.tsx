import Image from 'next/image';
import React from 'react';

export type PoweredByNotifiProps = {
  width?: number;
  height?: number;
  isLightLogo?: boolean;
};

export const PoweredByNotifi: React.FC<PoweredByNotifiProps> = ({
  width,
  height,
  isLightLogo,
}: PoweredByNotifiProps) => {
  // placeholder for now, will use image later
  return (
    <Image
      src={
        isLightLogo
          ? '/logos/powered-by-notifi-light.png'
          : '/logos/powered-by-notifi.png'
      }
      width={width ? width : 96}
      height={height ? height : 13}
      alt="Powered by notifi"
      unoptimized={true}
    />
  );
};
