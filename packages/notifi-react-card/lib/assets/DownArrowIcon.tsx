import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const DownArrowIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 7.47054L5 10.9999M5 10.9999L9 7.47054M5 10.9999V1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
