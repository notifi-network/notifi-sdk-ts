import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const UpArrowIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="14"
      height="12"
      viewBox="-2 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 4.52946L5 1.00007M5 1.00007L9 4.52946M5 1.00007V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
