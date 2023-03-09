import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const SwapIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.32357 17.9999L4.50007 14.7999M4.50007 14.7999L7.32357 11.5999M4.50007 14.7999H12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6764 12.4L19.4999 9.20003M19.4999 9.20003L16.6764 6.00004M19.4999 9.20003H11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
