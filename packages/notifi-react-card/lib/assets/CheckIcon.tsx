import React from 'react';

export type Props = Readonly<
  {
    className?: string;
  } & React.SVGProps<SVGSVGElement>
>;

export const CheckIcon: React.FC<Props> = ({ className, ...svgProps }) => {
  return (
    <svg
      className={className}
      {...svgProps}
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
