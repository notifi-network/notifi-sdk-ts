import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const UpArrowIcon: React.FC<Props> = (props: Props) => {
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
        d="M1 4.52946L5 1.00007M5 1.00007L9 4.52946M5 1.00007V11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
