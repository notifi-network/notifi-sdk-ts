import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const RatioCheckIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="9" r="1.75" stroke="currentFill" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="1.75" stroke="currentFill" strokeWidth="1.5" />
      <line
        x1="9.22548"
        y1="16.4982"
        x2="14.8394"
        y2="6.77452"
        stroke="currentFill"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
