import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const CheckIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12.5L9.84 16L18 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
